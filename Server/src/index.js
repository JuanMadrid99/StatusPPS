//# Copyright (c) 2024 Juan Ramón Madrid
//# Este software está protegido bajo una Licencia de Uso Personalizada.
//# Uso personal y académico permitido. Prohibido el uso comercial o la redistribución sin autorización.
//# Consulta el archivo LICENSE para más detalles.

import { connectToDatabase, syncStore } from './db/session.js';
import app from "./app.js";
const port = 88;
import debug from 'debug';

const debugServer = debug('app:server');

if (process.env.NODE_ENV === 'development') {
  debug.enable('app:*');
} else {
  debug.disable();
}


const startServer = async () => {
  try {
    await connectToDatabase();
    await syncStore();
    app.listen(port, () => {
      debugServer(`Servidor backend escuchando en :${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
};


startServer();