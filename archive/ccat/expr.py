"""Safe arithmetic expressions for recipes and table formulas.

Names may be any Python identifier, Cyrillic included (П, Т40, ДОР). Source
adapters are responsible for normalizing look-alike glyphs (Latin T vs
Cyrillic Т, decimal commas) before expressions get here.

Supported: numbers, names, + - * / **, unary -, parentheses, the functions
in FUNCS, and point functions such as dist("11", "91") whose arguments are
point names given as string literals.
"""
import ast
import math


class ExprError(ValueError):
    pass


FUNCS = {'sqrt': math.sqrt, 'abs': abs, 'min': min, 'max': max,
         'sin': lambda d: math.sin(math.radians(d)), 'cos': lambda d: math.cos(math.radians(d)),
         'tan': lambda d: math.tan(math.radians(d)),
         'atan': lambda x: math.degrees(math.atan(x)), 'asin': lambda x: math.degrees(math.asin(x)),
         'acos': lambda x: math.degrees(math.acos(x))}

_BIN = {ast.Add: lambda a, b: a + b, ast.Sub: lambda a, b: a - b, ast.Mult: lambda a, b: a * b,
        ast.Div: lambda a, b: a / b, ast.Pow: lambda a, b: a ** b}


def _parse(text):
    if isinstance(text, (int, float)):
        return ast.Expression(ast.Constant(float(text)))
    try:
        return ast.parse(str(text).strip(), mode='eval')
    except SyntaxError as e:
        raise ExprError(f'cannot parse expression {text!r}: {e.msg}') from None


def names(text):
    """Free variable names referenced by an expression (not function names)."""
    tree = _parse(text)
    called = {n.func.id for n in ast.walk(tree) if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)}
    return {n.id for n in ast.walk(tree) if isinstance(n, ast.Name)} - called


def evaluate(text, lookup, point_funcs=None):
    """Evaluate text. lookup(name) -> float (raise KeyError if unknown).
    point_funcs: {fname: callable(*point_names) -> float}."""
    point_funcs = point_funcs or {}

    def ev(node):
        if isinstance(node, ast.Expression):
            return ev(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
            return float(node.value)
        if isinstance(node, ast.Name):
            try:
                return float(lookup(node.id))
            except KeyError:
                raise ExprError(f'unknown name {node.id!r} in {text!r}') from None
        if isinstance(node, ast.BinOp) and type(node.op) in _BIN:
            try:
                return _BIN[type(node.op)](ev(node.left), ev(node.right))
            except ZeroDivisionError:
                raise ExprError(f'division by zero in {text!r}') from None
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
            v = ev(node.operand)
            return -v if isinstance(node.op, ast.USub) else v
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and not node.keywords:
            fn = node.func.id
            if fn in point_funcs:
                args = []
                for a in node.args:
                    if not (isinstance(a, ast.Constant) and isinstance(a.value, str)):
                        raise ExprError(f'{fn}() takes quoted point names, in {text!r}')
                    args.append(a.value)
                return float(point_funcs[fn](*args))
            if fn in FUNCS:
                try:
                    return float(FUNCS[fn](*[ev(a) for a in node.args]))
                except (ValueError, TypeError) as e:
                    raise ExprError(f'{fn}() failed in {text!r}: {e}') from None
            raise ExprError(f'unknown function {fn!r} in {text!r}')
        raise ExprError(f'unsupported syntax {type(node).__name__} in {text!r}')

    return ev(_parse(text))
