const { app, BrowserWindow } = require('electron');

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 800, // Ajustado el ancho para que la tabla de productos sea legible y no se corte
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  ventana.loadFile('index.html');
}

app.whenReady().then(crearVentana);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});