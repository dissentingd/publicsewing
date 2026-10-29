#!/bin/bash
# In the container: for every /work/*.sm2d, load it (--test) and export its layout as AAMA DXF
# to /work/dxf; for every /work/*.smis, load it in SeamlyMe. One line per file:
# "<file> test <exit> dxf <exit>" (0 = fine; dxf "toobig": a piece wider than the roll).
Xvfb :9 -screen 0 1280x900x24 >/dev/null 2>&1 &
sleep 2
export DISPLAY=:9
mkdir -p /work/dxf /work/log
for f in /work/*.sm2d; do
  b=$(basename "$f" .sm2d)
  timeout 180 /opt/seamly/AppRun --test "$f" > "/work/log/$b.test.log" 2>&1; t=$?
  # The widest roll (44 in, template 15), so no long piece is refused for size; custom page
  # sizes (-W/-H) exit 64 in this build
  timeout 300 /opt/seamly/AppRun "$f" -d /work/dxf -b "$b" -f 20 -p 15 > "/work/log/$b.dxf.log" 2>&1; d=$?
  # A piece wider than the roll is Seamly's layout limit, not a fault in the file
  [ "$d" = 65 ] && grep -q "bigger than the paper format" "/work/log/$b.dxf.log" && d=toobig
  echo "$b.sm2d test $t dxf $d"
done
for f in /work/*.smis; do
  [ -e "$f" ] || continue
  timeout 60 /opt/seamly/usr/bin/seamlyme --test "$f" > "/work/log/$(basename "$f").log" 2>&1
  echo "$(basename "$f") test $?"
done
# Leave the files to whoever owns /work on the host, not root
chown -R "$(stat -c %u:%g /work)" /work
