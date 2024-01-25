const pool = require('../db');

async function guardar_historia_clinica(historia) {
    try {
        const consulta = `
        INSERT INTO public.historia_clinica(
            diagnostico, evolucion, motivo_consulta, numero_historia, id_antecedente, id_cita_medica, id_examen_fisico, id_tratamiento)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const values = [
            historia.diagnostico,
            historia.evolucion,
            historia.motivo_consulta,
            historia.numero_historia,
            historia.id_antecedente,
            historia.id_cita_medica,
            historia.id_examen_fisico,
            historia.id_tratamiento
        ];

        const result = await pool.query(consulta, values);
        return result;

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

async function actualizarHistoria(historia) {
    try {
        const consulta = `
        UPDATE historia_clinica
        SET 
        diagnostico = $1, 
        evolucion = $2, 
        motivo_consulta = $3, 
        where id_historia_clinica = $4
        `;
        const values = [
            historia.diagnostico,
            historia.evolucion,
            historia.motivo_consulta,
            historia.id_historia_clinica
        ];

        const result = await pool.query(consulta, values);
        return result;

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

async function listarHistoriaClinicaPorMedico(id_medico) {
    try {
        const consulta = `
        
        SELECT DISTINCT p.cedula, p.primer_nombre, p.primer_apellido, p.segundo_apellido, cm.id_paciente, cm.id_medico, 
		hc.numero_historia, hc.diagnostico, hc.evolucion, hc.motivo_consulta,
        a.id_antecedente, a.antecedente_alergico, a.antecedente_familiar, a.antecedente_personal, a.antecedente_quirurgico,
        ef.id_examen_fisico, ef.estatura, ef.frecuencia_respiratoria, ef.peso, ef.pulso,ef.presion_arterial, ef.tipo_sanguineo, ef.temperatura,
        t.id_tratamiento, t.indicaciones, t.duracion, t.medicacion
        FROM medico m 
        INNER JOIN usuario u ON m.id_usuario = u.id_usuario
        INNER JOIN cita_medica cm ON cm.id_medico = m.id_medico
        INNER JOIN paciente p ON p.id_paciente = cm.id_paciente
        INNER JOIN historia_clinica hc ON hc.id_cita_medica = cm.id_cita_medica
        INNER JOIN antecedente a ON a.id_antecedente= hc.id_antecedente   
        INNER JOIN examen_fisico ef ON ef.id_examen_fisico = hc.id_examen_fisico
        INNER JOIN tratamiento t ON t.id_tratamiento = hc.id_tratamiento
        WHERE m.id_usuario =  $1
        `;

        const values = [id_medico]
        const citas = await pool.query(consulta, values);
        return citas.rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

async function listarHistoriaClinicaPorPaciente(id_usuario) {
    try {
        const consulta = `
        SELECT DISTINCT p.cedula, p.primer_nombre, p.primer_apellido, p.segundo_apellido, cm.id_paciente, cm.id_medico, 
		hc.numero_historia, hc.diagnostico, hc.evolucion, hc.motivo_consulta,
        a.antecedente_alergico, a.antecedente_familiar, a.antecedente_personal, a.antecedente_quirurgico,
        ef.estatura, ef.frecuencia_respiratoria, ef.peso, ef.pulso,ef.presion_arterial, ef.tipo_sanguineo, ef.temperatura,
        t.indicaciones, t.duracion, t.medicacion
        FROM medico m 
        INNER JOIN usuario u ON m.id_usuario = u.id_usuario
        INNER JOIN cita_medica cm ON cm.id_medico = m.id_medico
        INNER JOIN paciente p ON p.id_paciente = cm.id_paciente
        INNER JOIN historia_clinica hc ON hc.id_cita_medica = cm.id_cita_medica
        INNER JOIN antecedente a ON a.id_antecedente= hc.id_antecedente   
        INNER JOIN examen_fisico ef ON ef.id_examen_fisico = hc.id_examen_fisico
        INNER JOIN tratamiento t ON t.id_tratamiento = hc.id_tratamiento
        WHERE p.id_usuario =  $1
        `;

        const values = [id_usuario]
        const citas = await pool.query(consulta, values);
        return citas.rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}


async function listarPacientesCorrespondientesAMedico(id_medico) {
    try {
        const consulta = `

        SELECT HC.ID_HISTORIA_CLINICA, HC.NUMERO_HISTORIA, 
        P.PRIMER_NOMBRE,P.PRIMER_APELLIDO, P.correo, P.telefono_fijo, P.telefono_movil, P.fecha_nacimiento, P.estado_civil
               FROM USUARIO U
               INNER JOIN MEDICO M ON U.ID_USUARIO = M.ID_USUARIO
               INNER JOIN CITA_MEDICA CM ON CM.ID_MEDICO = M.ID_MEDICO
               INNER JOIN PACIENTE P ON P.ID_PACIENTE = CM.ID_PACIENTE
               INNER JOIN HISTORIA_CLINICA HC ON HC.id_cita_medica = CM.id_cita_medica
               WHERE M.ID_USUARIO = $1
        `;

        const values = [id_medico]
        const citas = await pool.query(consulta, values);
        return citas.rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

async function listarTodoPacientes() {
    try {
        const consulta = `
        SELECT HC.ID_HISTORIA_CLINICA, HC.NUMERO_HISTORIA, HC.diagnostico, HC.evolucion, HC.motivo_consulta,
        P.PRIMER_NOMBRE,P.PRIMER_APELLIDO, P.correo, P.telefono_fijo, P.telefono_movil, 
        P.fecha_nacimiento, P.estado_civil, P.cedula,
		a.antecedente_alergico, a.antecedente_familiar, a.antecedente_personal, a.antecedente_quirurgico,
        ef.estatura, ef.frecuencia_respiratoria, ef.peso, ef.pulso,ef.presion_arterial, ef.tipo_sanguineo, ef.temperatura,
        t.indicaciones, t.duracion, t.medicacion
        FROM USUARIO U
        INNER JOIN MEDICO M ON U.ID_USUARIO = M.ID_USUARIO
        INNER JOIN CITA_MEDICA CM ON CM.ID_MEDICO = M.ID_MEDICO
        INNER JOIN PACIENTE P ON P.ID_PACIENTE = CM.ID_PACIENTE
		INNER JOIN HISTORIA_CLINICA HC ON HC.id_cita_medica = CM.id_cita_medica
		INNER JOIN ANTECEDENTE A ON A.id_antecedente = HC.id_antecedente
		INNER JOIN examen_fisico EF ON EF.id_examen_fisico = HC.id_examen_fisico
		INNER JOIN TRATAMIENTO T ON T.id_tratamiento = HC.id_tratamiento
        `;

        const citas = await pool.query(consulta);
        return citas.rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}


module.exports = {
    guardar_historia_clinica,
    listarHistoriaClinicaPorMedico,
    listarPacientesCorrespondientesAMedico,
    listarTodoPacientes,
    listarHistoriaClinicaPorPaciente,
    actualizarHistoria
};