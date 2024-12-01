export const BiometricoData = async (deviceinfo) => {
     let conexion = ''
     if (deviceinfo) {
        conexion = 'Conexión TCP establecida';
    }
    const DataBiometrico = {
        informacionimportante: conexion,
        informacionimportante2: '',
        informacionrelevante: '',
        informaciontecnica: ''
    }

    return DataBiometrico;
};

export const Biometricohardware = async (responseCode, buffer) => { 
    let response = '';
    if (responseCode === 2000) {
        
    
        if (buffer.length < 16) {
            response = '';
        } else {
        
            const versionBuffer = buffer.slice(8, buffer.indexOf(0, 10));
            const versionString = versionBuffer.toString('utf8').trim();
            
        
            response = versionString.replace(/\s+/g, ' ');
        }
    } else {
        response = '';
    }

    const HardwareBiometrico = {
        informaciongeneral: response ? `Firmware: ${response}` : ''
    };

    return HardwareBiometrico;
};


