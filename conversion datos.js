use('calidad_del_aire');

// Encuentra todos los documentos en la colección original
var documentosOriginales = db.mediciones_PM10.find();

// Recorre cada documento y convierte y copia los datos a la nueva colección
documentosOriginales.forEach(function(documentoOriginal) {
    // Convierte la fecha string en un objeto Date
    var fechaOriginalStr = documentoOriginal.Fecha;
    var partesFechaHora = fechaOriginalStr.split(' ');
    var partesFecha = partesFechaHora[0].split('/');
    var partesHora = partesFechaHora[1].split(':');
    var amPm = partesFechaHora[2];

    var dia = parseInt(partesFecha[0], 10);
    var mes = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript son 0-indexados
    var anio = parseInt(partesFecha[2], 10);
    var hora = parseInt(partesHora[0], 10);
    var minuto = parseInt(partesHora[1], 10);
    var segundo = parseInt(partesHora[2], 10);

    // Convertir hora a formato 24 horas
    if (amPm === 'p.' && hora !== 12) {
        hora += 12;
    } else if (amPm === 'a.' && hora === 12) {
        hora = 0;
    }

    var fechaOriginal = new Date(anio, mes, dia, hora, minuto, segundo);

    // Crea el nuevo documento con los campos requeridos
    var nuevoDocumento = {
        _id: documentoOriginal._id,
        dia: dia,
        mes: mes + 1, // Ajustando el mes para que esté en el rango 1-12
        año: anio,
        hora: hora,
        estacion: ObjectId(documentoOriginal.estacion.id), // Convertir a ObjectId
        variable: documentoOriginal.Variable,
        unidades: documentoOriginal.Unidades,
        "código DANE municipio": documentoOriginal.ubicacion["Código DANE Municipio"],
        concentración: documentoOriginal.Concentración,
        "tiempo de exposición": documentoOriginal.tiempo_de_exposicion // Convertido a camelCase
    };

    // Inserta el nuevo documento en la nueva colección
    db.muestreo_ML.insertOne(nuevoDocumento);
});
// Imprime un mensaje indicando que se han insertado los registros correctamente
print("Se han insertado todos los registros correctamente en la nueva colección.");
