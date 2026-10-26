# GarmentCode + its NVIDIA Warp fork (CUDA), pinned to the versions verified
# on a CUDA machine 2026-10-16.
#
# Note: the Warp fork is under the NVIDIA Source Code License
# (non-commercial). Fine for personal testing; not for public hosting.

ARG CUDA_TAG=12.1.1
ARG GARMENTCODE_REF=d449629979028123a5c4dc9e732a2ec19b7fce31
ARG WARP_REF=63baf6855efdd89b2834b74640f84b3bb0d86b50

# ---------- build: Warp fork with CUDA ----------
FROM nvidia/cuda:${CUDA_TAG}-devel-ubuntu22.04 AS build
ARG WARP_REF
ENV DEBIAN_FRONTEND=noninteractive UV_PYTHON_INSTALL_DIR=/opt/python
RUN apt-get update && apt-get install -y --no-install-recommends \
        git ca-certificates curl build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY --from=ghcr.io/astral-sh/uv:0.12.7 /uv /usr/local/bin/uv
RUN uv python install 3.9.25 && uv venv --python 3.9.25 /opt/venv
ENV VIRTUAL_ENV=/opt/venv PATH=/opt/venv/bin:$PATH

RUN git clone https://github.com/maria-korosteleva/NvidiaWarp-GarmentCode.git /opt/warp \
    && git -C /opt/warp checkout ${WARP_REF} \
    && chmod +x /opt/warp/tools/packman/packman
WORKDIR /opt/warp
# --quick: PTX only, no CUTLASS; kernels JIT-compile for the GPU at load
RUN uv pip install setuptools wheel numpy==1.26.4 \
    && python build_lib.py --cuda_path=/usr/local/cuda --quick --no_verbose \
    && rm -rf /root/.cache/packman

# ---------- runtime ----------
FROM nvidia/cuda:${CUDA_TAG}-runtime-ubuntu22.04
ARG GARMENTCODE_REF
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
        git ca-certificates libcairo2 libgl1 libegl1 libglib2.0-0 libgomp1 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /opt/python /opt/python
COPY --from=build /opt/venv /opt/venv
COPY --from=build /opt/warp /opt/warp
COPY --from=build /usr/local/bin/uv /usr/local/bin/uv
ENV VIRTUAL_ENV=/opt/venv PATH=/opt/venv/bin:$PATH

COPY requirements.lock.txt /tmp/requirements.lock.txt
RUN uv pip install -r /tmp/requirements.lock.txt \
    && uv pip install --no-deps -e /opt/warp

RUN git clone https://github.com/maria-korosteleva/GarmentCode.git /opt/garmentcode \
    && git -C /opt/garmentcode checkout ${GARMENTCODE_REF} \
    && uv pip install --no-deps -e /opt/garmentcode \
    # container listens on all its interfaces; the host maps it to 127.0.0.1 only
    && sed -i 's/reload=False,/reload=False, host="0.0.0.0", port=8080,/' /opt/garmentcode/gui.py \
    && sed 's#"./Logs/"#"/data/Logs/"#' /opt/garmentcode/system.template.json > /opt/garmentcode/system.json

# GUI writes tmp_gui/ inside its own source dir, so app must own it
# pre-create ~/.cache so the warp-cache mount doesn't leave it root-owned (matplotlib needs it)
RUN useradd -m -u 1000 app && mkdir -p /data /home/app/.cache/warp \
    && chown app /data && chown -R app /opt/garmentcode /home/app/.cache
USER app
ENV HOME=/home/app PYTHONPATH=/opt/garmentcode
WORKDIR /opt/garmentcode
EXPOSE 8080
CMD ["python", "gui.py"]
