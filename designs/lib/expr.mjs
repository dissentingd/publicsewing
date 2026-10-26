// Expressions in specs: numbers, 'strings', null, names, + - * / ( ), comparisons
// (== != < <= > >=), and / or / not, and the functions min, max, abs and if(cond, a, b).
// `chest * buttonExtension`, `min(cfWaist.y + waistToSeat * 0.8, cfHem.y - ext)`,
// `if(neckStyle == 'open', underarm.y - chest * 0.04, null)`.
// Names (with dots) are looked up by the caller's `lookup(name)`.
const fns = { min: Math.min, max: Math.max, abs: Math.abs }

function tokens(src) {
  const re = /\s*(\d+(?:\.\d+)?|'[^']*'|[A-Za-z_][\w.]*|==|!=|<=|>=|[-+*/(),<>])/y
  const out = []
  const end = src.trimEnd().length
  let at = 0
  while (at < end) {
    re.lastIndex = at
    const m = re.exec(src)
    if (!m) throw new Error(`can't read expression "${src}" at ${at}`)
    out.push(m[1])
    at = re.lastIndex
  }
  return out
}

const binary = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
}

/** Compile an expression to a function of `lookup` */
export function compile(src) {
  const t = tokens(String(src))
  let i = 0
  const peek = () => t[i]
  const take = (want) => {
    if (want && t[i] !== want) throw new Error(`expected "${want}" in "${src}"`)
    return t[i++]
  }
  // Each level: operators it handles, and the next (tighter) level
  const level = (ops, next) => () => {
    let a = next()
    while (ops.includes(peek())) {
      const [f, l, r] = [binary[take()], a, next()]
      a = (k) => f(l(k), r(k))
    }
    return a
  }
  const unary = () => {
    if (peek() === '-' || peek() === 'not') {
      const op = take()
      const a = unary()
      return op === '-' ? (k) => -a(k) : (k) => !a(k)
    }
    return atom()
  }
  const product = level(['*', '/'], unary)
  const sum = level(['+', '-'], product)
  const compare = level(['==', '!=', '<', '<=', '>', '>='], sum)
  const and = () => {
    let a = compare()
    while (peek() === 'and') {
      take()
      const [l, r] = [a, compare()]
      a = (k) => l(k) && r(k)
    }
    return a
  }
  const or = () => {
    let a = and()
    while (peek() === 'or') {
      take()
      const [l, r] = [a, and()]
      a = (k) => l(k) || r(k)
    }
    return a
  }
  const args = () => {
    take('(')
    const list = [or()]
    while (peek() === ',') take() && list.push(or())
    take(')')
    return list
  }
  const atom = () => {
    const tok = take()
    if (tok === undefined) throw new Error(`"${src}" ends early`)
    if (tok === '(') {
      const a = or()
      take(')')
      return a
    }
    if (/^\d/.test(tok)) {
      const n = Number(tok)
      return () => n
    }
    if (tok.startsWith("'")) {
      const s = tok.slice(1, -1)
      return () => s
    }
    if (tok === 'null') return () => null
    if (tok === 'true' || tok === 'false') return () => tok === 'true'
    if (tok === 'if' && peek() === '(') {
      const [c, a, b] = args()
      if (!b) throw new Error(`if() takes three arguments in "${src}"`)
      return (k) => (c(k) ? a(k) : b(k))
    }
    if (fns[tok] && peek() === '(') {
      const list = args()
      return (k) => fns[tok](...list.map((a) => a(k)))
    }
    return (k) => k(tok)
  }
  const f = or()
  if (i < t.length) throw new Error(`unexpected "${t[i]}" in "${src}"`)
  return f
}

const cache = new Map()
/** Evaluate an expression; numbers and booleans pass through */
export function evaluate(src, lookup) {
  if (typeof src !== 'string') return src
  if (!cache.has(src)) cache.set(src, compile(src))
  return cache.get(src)(lookup)
}
