# Lightweight image for scan processing (grid detection, vectorization, PDF
# inspection). Separate from the GarmentCode image so that one stays pinned
# and lean. Run untrusted downloads through this with --network none.
FROM python:3.12.7-slim
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils tesseract-ocr tesseract-ocr-rus \
        fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir numpy==2.1.2 scipy==1.14.1 scikit-image==0.24.0 \
        opencv-python-headless==4.10.0.84 pillow==11.0.0 pyyaml==6.0.2 \
        pytest==8.3.3
# export layer (ccat.export): seam allowance, DXF, tiled PDF
RUN pip install --no-cache-dir shapely==2.1.2 ezdxf==1.4.2 reportlab==4.4.4
RUN useradd -m -u 1000 app
USER app
WORKDIR /work
