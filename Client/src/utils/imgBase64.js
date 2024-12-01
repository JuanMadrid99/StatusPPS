const imgBase64 = (url) => {
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        console.log("Creado por Juan Madrid, 2024.");
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL("image/png");
                    resolve(dataURL);
                } else {
                    reject(new Error("No se pudo obtener el contexto del canvas"));
                }
            } catch (e) {
                reject(new Error(`Error al procesar la imagen: ${e.message}`));
            }
        };

        img.onerror = (error) => {
            reject(new Error(`Error cargando la imagen desde la URL: ${url}, error: ${error.message}`));
        };

        img.src = url; 
    });
};

export default imgBase64;