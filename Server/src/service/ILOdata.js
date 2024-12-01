export const ILOdata = async (showData) => {
  
    const DataILO = {
        informacionimportante: ``,
        informacionimportante2: ``,
        informacionrelevante: ``,
        informaciontecnica: showData,
    }

    return DataILO;
};

export const ILOhardware = async () => {

    const HardwareILO = {
        informaciongeneral: ``
    }

    return HardwareILO;
};

export const ILOdescripcion = async () => {
    let Modelo = ''
    
    const descripcionILO = {
        descripcion: `${Modelo}`
    }
    return descripcionILO;
};