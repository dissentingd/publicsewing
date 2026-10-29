# Seamly2D, headless, to check the .sm2d and .smis files designs/tools/export.mjs writes
# (designs/tools/seamly-check.mjs drives it). Seamly2D is GPLv3+; this image only runs it.
#   docker build -t seamly-cli docker/seamly
FROM ubuntu:24.04
ARG SEAMLY=v2026.10.26.146
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      ca-certificates curl xvfb xauth libgl1 libegl1 libopengl0 libglib2.0-0 libfontconfig1 libfreetype6 \
      libdbus-1-3 libxkbcommon0 libxkbcommon-x11-0 libxcb-cursor0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 \
      libxcb-randr0 libxcb-render-util0 libxcb-shape0 libxcb-xinerama0 libxcb-xkb1 libxcb-xfixes0 libxcb-sync1 \
      libxrender1 libx11-xcb1 libsm6 libice6 fonts-dejavu-core \
 && rm -rf /var/lib/apt/lists/*
RUN cd /opt && curl -sSL -o seamly.AppImage \
      https://github.com/FashionFreedom/Seamly2D/releases/download/${SEAMLY}/Seamly2D-x86_64.AppImage \
 && chmod +x seamly.AppImage && ./seamly.AppImage --appimage-extract >/dev/null \
 && mv squashfs-root seamly && rm seamly.AppImage
# No first-run welcome dialog (it would block the command line): "true" means don't show it
RUN mkdir -p /root/.config/Seamly2DTeam \
 && printf '[configuration]\nshowWelcome=true\nconfirm_format_rewriting=false\n' > /root/.config/Seamly2DTeam/qt6_seamly2d.ini
COPY check.sh /usr/local/bin/seamly-check
WORKDIR /work
ENTRYPOINT ["seamly-check"]
