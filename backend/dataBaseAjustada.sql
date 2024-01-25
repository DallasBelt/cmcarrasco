create table antecedente
(
    id_antecedente         serial
        primary key,
    antecedente_alergico   varchar(255),
    antecedente_familiar   varchar(255),
    antecedente_personal   varchar(255),
    antecedente_quirurgico varchar(255)
);

alter table antecedente
    owner to postgres;

create table examen_fisico
(
    id_examen_fisico        serial
        primary key,
    estatura                varchar(255),
    frecuencia_respiratoria varchar(255),
    peso                    varchar(255),
    presion_arterial        varchar(255),
    pulso                   varchar(255),
    temperatura             varchar(255),
    tipo_sanguineo          varchar(255)
);

alter table examen_fisico
    owner to postgres;

create table tratamiento
(
    id_tratamiento serial
        primary key,
    duracion       varchar(255),
    indicaciones   varchar(255),
    medicacion     varchar(255)
);

alter table tratamiento
    owner to postgres;

create table usuario
(
    id_usuario     serial
        primary key,
    activo         boolean,
    contrasenia    varchar(255),
    correo         varchar(255),
    nombre_usuario varchar(255),
    tipo_usuario   varchar(255)
);

alter table usuario
    owner to postgres;

create table medico
(
    id_medico        serial
        primary key,
    cedula           varchar(255),
    correo           varchar(255),
    especialidad     text,
    estado_civil     varchar(255),
    fecha_nacimiento timestamp(6),
    licencia         varchar(255),
    primer_apellido  varchar(255),
    primer_nombre    varchar(255),
    segundo_apellido varchar(255),
    segundo_nombre   varchar(255),
    telefono_fijo    varchar(255),
    telefono_movil   varchar(255),
    id_usuario       bigint
        constraint medico_usuario_fk
            references usuario
            on delete cascade,
    direccion        text,
    horarios         text
);

alter table medico
    owner to postgres;

create table paciente
(
    id_paciente      serial
        primary key,
    cedula           varchar(10),
    correo           varchar(255)
        constraint correo_uk
            unique,
    estado_civil     varchar(255),
    fecha_nacimiento date,
    primer_apellido  varchar(255),
    primer_nombre    varchar(255),
    segundo_apellido varchar(255),
    segundo_nombre   varchar(255),
    telefono_fijo    varchar(255),
    telefono_movil   varchar(255),
    id_usuario       bigint
        constraint paciente_usuario_fk
            references usuario
            on delete cascade,
    direccion        text
);

alter table paciente
    owner to postgres;

create table cita_medica
(
    id_cita_medica serial
        primary key,
    especialidad   varchar(255),
    estado         varchar(255),
    fecha_fin      timestamp with time zone,
    fecha_inicio   timestamp with time zone,
    observacion    varchar(255),
    id_medico      bigint
        constraint cita_medica_medico_fk
            references medico
            on delete cascade,
    id_paciente    bigint
        constraint cita_medica_paciente_fk
            references paciente
            on delete cascade
);

alter table cita_medica
    owner to postgres;

create table historia_clinica
(
    id_historia_clinica serial
        primary key,
    diagnostico         varchar(255),
    evolucion           varchar(255),
    motivo_consulta     varchar(255),
    numero_historia     varchar(255),
    id_antecedente      bigint
        constraint historia_clinica_antecedente_fk
            references antecedente,
    id_cita_medica      bigint
        constraint historia_clinica_cita_medica_fk
            references cita_medica
            on delete cascade,
    id_examen_fisico    bigint
        constraint historia_clinica_examen_fisico_fk
            references examen_fisico,
    id_tratamiento      bigint
        constraint historia_clinica_tratamiento_fk
            references tratamiento
            on delete cascade
);

alter table historia_clinica
    owner to postgres;

create table secretaria
(
    id_secretaria    serial
        primary key,
    cedula           varchar(10),
    correo           varchar(255)
        constraint secretaria_uk
            unique,
    estado_civil     varchar(255),
    fecha_nacimiento date,
    primer_apellido  varchar(255),
    primer_nombre    varchar(255),
    segundo_apellido varchar(255),
    segundo_nombre   varchar(255),
    telefono_fijo    varchar(255),
    telefono_movil   varchar(255),
    id_usuario       bigint
        constraint secretaria_usuario_fk
            references usuario
);

alter table secretaria
    owner to postgres;
