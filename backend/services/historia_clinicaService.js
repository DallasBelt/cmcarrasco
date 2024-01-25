const historia_clinica_Querys = require('../querys/historia_clinicaQuerys');
const cita_meida_Querys = require('../querys/citaQuerys');
const antecedenteService = require('./antecedenteService');
const examen_fisicoService = require('./examen_fisicoService');
const tratamientoService = require('./tratamientoService');
const tratamientoQuery = require('../querys/tratamientoQuerys');
const examenFisicoQuery = require('../querys/examen_fisicoQuerys');
const antecedenteQuery = require('../querys/antecedenteQuerys');

async function guardar_historia_clinica(historia) {
    try {

        const nuevoTratamiento = {
            duracion: historia.tratamiento.duracion,
            indicaciones: historia.tratamiento.indicaciones,
            medicacion: historia.tratamiento.medicacion,
        };
        const tratamientoGuardado = await tratamientoService.guardar_tratamiento(nuevoTratamiento);
        console.log("Datos del tratamiento" + tratamientoGuardado);

        const nuevoAntecedente = {
            antecedente_alergico: historia.antecedente.antecedente_alergico,
            antecedente_familiar: historia.antecedente.antecedente_familiar,
            antecedente_personal: historia.antecedente.antecedente_personal,
            antecedente_quirurgico: historia.antecedente.antecedente_quirurgico,
        };
        
        const antecedenteGuardado = await antecedenteService.guardar_antecedente(nuevoAntecedente);

        const nuevoExamenFisico = {
            estatura: historia.examen_fisico.estatura,
            frecuencia_respiratoria: historia.examen_fisico.frecuencia_respiratoria,
            peso: historia.examen_fisico.peso,
            presion_arterial: historia.examen_fisico.presion_arterial,
            pulso: historia.examen_fisico.pulso,
            temperatura: historia.examen_fisico.temperatura,
            tipo_sanguineo: historia.examen_fisico.tipo_sanguineo
        };
        const examen_fisicoGuardado = await examen_fisicoService.guardar_examen_fisico(nuevoExamenFisico);

        // Crear un nuevo paciente asociado al usuario
        const nuevaHistoria = {
            diagnostico: historia.diagnostico,
            evolucion: historia.evolucion,
            motivo_consulta: historia.motivo_consulta,
            numero_historia: historia.numero_historia,
            id_antecedente: antecedenteGuardado.id_antecedente,
            id_cita_medica: historia.cita_medica.id_cita_medica,
            id_examen_fisico: examen_fisicoGuardado.id_examen_fisico,
            id_tratamiento: tratamientoGuardado.id_tratamiento
        };

        console.log(nuevaHistoria);
        // Guardar el nuevo paciente en la base de datos
        await historia_clinica_Querys.guardar_historia_clinica(nuevaHistoria);

        // actualizar el estado de la cita medica
        await cita_meida_Querys.cambiarEstado(historia.cita_medica.id_cita_medica);

        return 'Historia guardada correctamente.';
    } catch (error) {
        console.error('Error al guardar la historia clínica. ', error);
        throw new Error('Error al guardar historia clínica en la base de datos');
    }
}
async function actualizarHistoria(historia) {
    try {
        const nuevaHistoria = {
            diagnostico: historia.diagnostico,
            evolucion: historia.evolucion,
            motivo_consulta: historia.motivo_consulta,
            id_historia_clinica: historia.id_historia_clinica
        };

        await historia_clinica_Querys.actualizarHistoria(nuevaHistoria);

        return 'Tratamiento actualizado correctamente.';
    } catch (error) {
        throw new Error('Error al guardar el paciente en la base de datos');
    }
}

async function actualizarTratamiento(tratamiento) {
    try {
        const nuevoTratamiento = {
            duracion: tratamiento.duracion,
            indicaciones: tratamiento.indicaciones,
            medicacion: tratamiento.medicacion,
            id_tratamiento: tratamiento.id_tratamiento,
        };

        await tratamientoQuery.actualizarTratamiento(nuevoTratamiento);

        return 'Tratamiento actualizado correctamente.';
    } catch (error) {
        throw new Error('Error al guardar el paciente en la base de datos');
    }
}

async function actualizarExamenFisico(examen_fisico) {
    try {
        const nuevoExamen_fisico = {
           estatura: examen_fisico.estatura,
           frecuencia_respiratoria: examen_fisico.frecuencia_respiratoria,
           peso: examen_fisico.peso,
           presion_arterial: examen_fisico.presion_arterial,
           pulso: examen_fisico.pulso,
           temperatura: examen_fisico.temperatura,
           tipo_sanguineo:  examen_fisico.tipo_sanguineo,
           id_examen_fisico: examen_fisico.id_examen_fisico
        };
        
        await examenFisicoQuery.actualizarExamenFisico(nuevoExamen_fisico);

        return 'Exámen físico actualizado correctamente.';
    } catch (error) {
        throw new Error('Error al guardar el paciente en la base de datos');
    }
}

async function actualizarAntecedente(antecedente) {
    try {
        const nuevoAntecedente = {
    antecedente_alergico:antecedente.antecedente_alergico,
    antecedente_familiar:antecedente.antecedente_familiar,
    antecedente_personal:antecedente.antecedente_personal,
    antecedente_quirurgico:antecedente.antecedente_quirurgico,
    id_antecedente: antecedente.id_antecedente
        };
        
        await antecedenteQuery.actualizarAntecedente(nuevoAntecedente);

        return 'Exámen físico actualizado correctamente.';
    } catch (error) {
        throw new Error('Error al guardar el paciente en la base de datos');
    }
}

async function listarHistoriaClinicaPorMedico(id_medico) {
    try {
     const citas = await historia_clinica_Querys.listarHistoriaClinicaPorMedico(id_medico);
     return citas;
    } catch (error) {
        console.error('Error al listar las citas.', error);
    }
}

async function listarPacientesCorrespondientesAMedico(id_usuario) {
    try {
     const citas = await historia_clinica_Querys.listarPacientesCorrespondientesAMedico(id_usuario);
     return citas;
    } catch (error) {
        console.error('Error al listar las citas.', error);
    }
}

async function listarHistoriaClinicaPorPaciente(id_usuario) {
    try {
     const citas = await historia_clinica_Querys.listarHistoriaClinicaPorPaciente(id_usuario);
     return citas;
    } catch (error) {
        console.error('Error al listar las citas.', error);
    }
}

async function listarTodoPacientes() {
    try {
     const citas = await historia_clinica_Querys.listarTodoPacientes();
     return citas;
    } catch (error) {
        console.error('Error al listar los pacientes.', error);
    }
}

module.exports = {
    guardar_historia_clinica,
    listarHistoriaClinicaPorMedico,
    listarPacientesCorrespondientesAMedico,
    listarTodoPacientes,
    listarHistoriaClinicaPorPaciente,
    actualizarTratamiento,
    actualizarExamenFisico,
    actualizarAntecedente,
    actualizarHistoria
};
