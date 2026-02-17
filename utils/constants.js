export const prompt3 = `
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

No incluyas texto explicativo, solo el JSON.

Si el o los cartones son de 9x3, extrae los números en el orden, agrega 2 filas llenas de 0 por cartón e ignora los espacios en blanco.
`;

export const prompt2 = `Analiza esta imagen y devuelve un array en JSON donde extraigas los numeros de bingo en este formato [[[1,15,23,43,69], [2,16,24,45,70], ...]] donde el primer arreglo contiene cada carton de bingo que veas, si en alguno de las celdas no hay numero entero o esta en blanco, rellena los campos con el numero cero, si no hay cartones legibles devuelve un array vacio, si el o los cartones son de 9x3 extrae los numeros en el orden, agrega 2 filas llenas de 0 por carton e ignora los espacios en blanco`;

export const prompt = `
Tarea: Analiza la imagen adjunta que contiene uno o más cartones de bingo.

Salida Requerida: Devuelve un único array en formato JSON (application/json) con la siguiente estructura:

Para cartones de 5x5:
[
  [
    [n1,n2,n3,n4,n5],
    [n6,n7,n8,n9,n10],
    [n11,n12,n13,n14,n15],
    [n16,n17,n18,n19,n20],
    [n21,n22,n23,n24,n25]
  ],
  ...
]

Reglas:
- Siempre devolver arreglos de 5x5
- Si alguna celda no tiene número o es alfanumérica, sustituye por 0.
- Si no se detectan cartones de bingo, devuelve un array vacío.
- Solo considera cartones de 5x5 completos.
- La imagen puede estar girada, pero debe ser capaz de extraer los datos correctamente.


Para cartones de 9x3:
[
  [
    [n1,n2,n3,n4,n5],
    [n6,n7,n8,n9,n10],
    [n11,n12,n13,n14,n15],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  ...
]

Reglas:
- Siempre devolver arreglos de 5x5
- Si no se detectan cartones de bingo, devuelve un array vacío.
- Solo considera cartones de 9x3 completos.
- La imagen puede estar girada, pero debe ser capaz de extraer los datos correctamente.
- Ignora los espacios vacios y agrega los numeros en el mismo orden.
`;