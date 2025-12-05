export const prompt = `
Tarea: Analiza la imagen adjunta que contiene uno o más cartones de bingo.

Salida Requerida: Devuelve un único array en formato JSON (application/json) con la siguiente estructura:

JSON

[
  [
    [B1, I1, N1, G1, O1],
    [B2, I2, N2, G2, O2],
    [B3, I3, N3, G3, O3],
    [B4, I4, N4, G4, O4],
    [B5, I5, N5, G5, O5]
  ],
  [
    [B1, I1, N1, G1, O1],
    [B2, I2, N2, G2, O2],
    ... (para cada cartón legible)
  ]
]
Donde cada sub-array ([...]) representa un cartón de bingo completo con sus cinco columnas (B, I, N, G, O) y sus cinco filas.

Reglas de Extracción:

Extrae todos los números enteros visibles de cada cartón legible.

Rellena cada espacio del cartón que esté vacío o donde el número no sea legible con el valor 0 (cero).

Si no se encuentran cartones de bingo legibles en la imagen, devuelve un array JSON vacío: [].

Si identificas un id unico por cartón y entre los números esta en 0 el del centro, reemplazalo por este id

No incluyas texto explicativo, solo el JSON.`