export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Sistema nervioso" | "Trauma somático" | "Apego" | "Límites y autocuidado" | "Pareja";
  date: string;
  readTime: string;
  imageUrl: string;
  imageUrls?: string[];
  videoUrl?: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "por-que-tu-cuerpo-se-queda-en-modo-alerta",
    title: "¿Por qué tu cuerpo se queda en modo alerta aunque ya estés a salvo?",
    excerpt: "Comprende los mecanismos neurobiológicos que mantienen encendida la respuesta de supervivencia y aprende a enviarle señales reales de seguridad a tu sistema nervioso.",
    category: "Sistema nervioso",
    date: "14 Oct 2026",
    readTime: "5 min de lectura",
    imageUrl: "/src/assets/images/blog_nervous_system_1792597406633.jpg",
    content: [
      "¿Te ha pasado alguna vez que, aun estando en la comodidad de tu casa, con todas las tareas del día cumplidas y sin ningún peligro evidente, tu pecho sigue apretado, tu respiración es superficial y sientes una urgencia inexplicable de estar alerta?",
      "Muchas personas interpretan este estado como un fallo personal o una señal de 'debilidad emocional'. Sin embargo, desde la perspectiva de la neurobiología y la psicoterapia clínica, la realidad es muy distinta: tu sistema nervioso no está roto, está cumpliendo diligentemente con un programa de supervivencia que quedó fijado en el pasado.",
      "El sistema nervioso autónomo opera a través de una rama simpática (encargada de la movilización: lucha o huida) y una rama parasimpática (responsable del descanso, digestión y conexión social). Cuando atravesamos periodos prolongados de estrés crónico, invalidación emocional o experiencias abrumadoras, la amígdala y el tronco encefálico aprenden a clasificar la neutralidad como una amenaza potencial.",
      "Esto significa que el cuerpo no distingue entre una discusión ocurrida hace cinco años y el silencio de una noche tranquila. El estado de hipervigilancia es la memoria fisiológica del cuerpo diciendo: 'bajar la guardia en el pasado fue doloroso, así que me mantendré despierto por si acaso'.",
      "Para desactivar este bucle no basta con decirte intelectualmente 'cálmate, no pasa nada'. Las órdenes racionales rara vez penetran las capas subcorticales del cerebro. La vía de salida es somática: a través del contacto con el apoyo del suelo, la exhalación prolongada que activa el nervio vago ventral, y la orientación visual consciente hacia espacios que evocan serenidad.",
      "Aprender a habitar el presente requiere paciencia y acompañamiento terapéutico. Cuando le demostramos al cuerpo —con hechos fisiológicos y no solo con pensamientos— que el peligro ya pasó, la coraza finalmente comienza a ceder.",
    ],
  },
  {
    slug: "trauma-somatico-lo-que-tu-cuerpo-recuerda",
    title: "Trauma somático: lo que tu cuerpo recuerda aunque tu mente lo olvide",
    excerpt: "El dolor no procesado no desaparece con el tiempo; se almacena en tensiones musculares, patrones posturales y respuestas viscerales que la psicoterapia corporal puede liberar.",
    category: "Trauma somático",
    date: "8 Oct 2026",
    readTime: "6 min de lectura",
    imageUrl: "/src/assets/images/blog_somatic_trauma_1792597408054.jpg",
    content: [
      "Solemos creer que el trauma es un evento extraordinario y catastrófico guardado en forma de recuerdos nítidos en la memoria episódica. No obstante, las investigaciones contemporáneas en psicología del trauma demuestran que el trauma es, ante todo, una respuesta inconclusa en el cuerpo físico.",
      "Cuando experimentamos una sobrecarga emocional o relacional sin el sostén necesario para regularnos, el impulso instintivo del organismo queda truncado. La contracción muscular que preparaba la defensa, el nudo en la garganta que reprimió un llanto o el congelamiento visceral ante la desprotección permanecen activos en los tejidos fasciales y neuromusculares.",
      "Por esta razón, muchas personas acuden a consulta manifestando bruxismo crónico, migrañas recurrentes, colon irritable o dolores articulares sin causa médica aparente. El cuerpo está hablando el idioma de las experiencias que la mente racional intentó archivar para seguir adelante.",
      "En el trabajo clínico con enfoques somáticos como EMDR, IFS y Psicoterapia Sensoriomotriz, no forzamos al paciente a revivir relatos dolorosos una y otra vez. Por el contrario, aprendemos a rastrear las sensaciones sutiles (el calor, el temblor involuntario, el peso en el diafragma) para permitir que el organismo complete suavemente las respuestas que en su momento quedaron congeladas.",
      "Sanar el trauma somático no es olvidar lo vivido, sino quitarle al pasado el poder de dictar la tensión cotidiana de tu cuerpo. Mereces volver a sentir que tu propio cuerpo es un lugar seguro para vivir.",
    ],
  },
  {
    slug: "apego-ansioso-y-evitativo-perseguir-y-huir",
    title: "Apego ansioso y evitativo: por qué uno persigue y el otro huye",
    excerpt: "Descubre la danza invisible de la desregulación vincular: por qué mientras más insiste uno por cercanía, más necesita el otro distanciarse para sentirse seguro.",
    category: "Apego",
    date: "29 Sep 2026",
    readTime: "6 min de lectura",
    imageUrl: "/src/assets/images/blog_attachment_styles_1792597407234.jpg",
    content: [
      "En terapia de pareja, una de las dinámicas más frecuentes y desgastantes es el ciclo entre un estilo de apego ansioso y uno evitativo. Ambos miembros se aman profundamente, pero sus discusiones parecen seguir un guion prediseñado del cual no logran escapar.",
      "Para la persona con tendencias ansiosas, cualquier atisbo de distancia física o frialdad emocional activa una alarma de abandono inmediata. El sistema nervioso entra en simpatía acelerada: surge la necesidad urgente de explicaciones, llamadas reiteradas, preguntas inquisitivas o reproches. Su lema inconsciente es: 'si no te mantengo cerca, te perderé'.",
      "Por el contrario, para la persona con inclinaciones evitativas, la intensidad emocional y las exigencias de contacto se sienten como una invasión invasiva y asfixiante. Su sistema nervioso reacciona con un repliegue defensivo: el silencio, la retirada a otra habitación, la frialdad o la indiferencia fingida. Su lema es: 'si me expongo o dependo de ti, seré lastimado o controlado'.",
      "La tragedia de este ciclo es que la conducta defensiva de uno alimenta con precisión milimétrica el pánico del otro. Mientras el ansioso persigue para recuperar el vínculo, el evitativo huye para no sentirse abrumado; y cuanto más se distancia este último, mayor es la desesperación del primero.",
      "El camino de reparación no consiste en juzgar quién tiene la culpa, sino en reconocer que ambos están desregulados por viejas heridas de apego. La terapia ofrece un espacio neutral para aprender a pedir una pausa sin abandonar, y solicitar cercanía sin asfixiar.",
    ],
  },
  {
    slug: "como-poner-limites-sin-sentir-culpa",
    title: "Cómo poner límites sin sentir culpa",
    excerpt: "Poner límites no es levantar muros agresivos, sino definir las condiciones necesarias para amar y relacionarte sin traicionar tu propia integridad.",
    category: "Límites y autocuidado",
    date: "19 Sep 2026",
    readTime: "5 min de lectura",
    imageUrl: "/src/assets/images/blog_setting_boundaries_1792597408038.jpg",
    content: [
      "Decir 'no puedo este fin de semana', 'necesito descansar' o 'ese tono de voz me incomoda' despierta en muchas personas un oleaje instantáneo de remordimiento, angustia y miedo al rechazo. Preferimos asumir responsabilidades ajenas antes que tolerar la incomodidad de un límite honesto.",
      "Esta culpa no es una señal de que estés haciendo algo malo; es el residuo emocional de haber aprendido, en etapas tempranas del desarrollo, que tu valor y pertenencia dependían de ser complaciente, útil y fácil de complacer.",
      "Cuando creces asociando el amor con el autosacrificio, la autoafirmación se percibe internamente como un acto de agresión o egoísmo. Sin embargo, los límites no son herramientas para castigar a los demás, sino barandas de seguridad que protegen la continuidad de las relaciones.",
      "Una relación donde no puedes decir que no es una relación basada en la sumisión, no en el amor genuino. El resentimiento que acumulas cuando aceptas compromisos forzados tarde o temprano envenena el afecto que intentabas preservar.",
      "Aprender a tolerar la culpa inicial de un límite saludable es parte fundamental de la madurez emocional. La culpa pasará; la autodignidad recuperada permanecerá para siempre.",
    ],
  },
  {
    slug: "senales-de-que-tu-relacion-necesita-terapia-de-pareja",
    title: "Señales de que tu relación necesita terapia de pareja",
    excerpt: "No es necesario esperar al borde del divorcio o a una crisis irreparable; intervenir a tiempo permite reparar la conexión antes de que el resentimiento se fosilice.",
    category: "Pareja",
    date: "10 Sep 2026",
    readTime: "5 min de lectura",
    imageUrl: "/src/assets/images/blog_couple_distance_1792597409033.jpg",
    content: [
      "Existe un mito dañino según el cual la terapia de pareja es el último recurso antes de la firma de una separación definitiva. En realidad, esperar a que los cuatro jinetes del apocalipsis relacional (crítica, desprecio, actitud defensiva y aislamiento) hayan erosionado la base de la relación dificulta innecesariamente el proceso.",
      "Una de las señales más claras de que es momento de buscar acompañamiento profesional es cuando las discusiones dejan de tener como objetivo resolver un problema y se convierten en batallas por tener la razón. El desgaste de repetir la misma disputa circular mes tras mes agota los recursos de cualquier vínculo.",
      "Otra señal sutil pero profunda es la desconexión afectiva silenciosa: cuando conviven como amables 'compañeros de piso', evitando el conflicto a costa de abandonar la intimidad, la risa compartida y la vulnerabilidad.",
      "La falta de reparación tras una discusión también indica que los mecanismos naturales de reconciliación están dañados. Si los episodios de tensión se saldan con días de frialdad mutua sin que nadie tienda un puente de empatía, las heridas quedan abiertas bajo la superficie.",
      "La psicoterapia de pareja guiada con rigor clínico permite desmontar los patrones reactivos, comprender el mundo interno del otro y construir acuerdos sólidos donde ambos miembros se sientan escuchados y respetados.",
    ],
  },
  {
    slug: "el-cansancio-de-ser-siempre-la-fuerte",
    title: "El cansancio de ser siempre 'la fuerte': cuando cuidar a todos te agota",
    excerpt: "Exploramos el síndrome del pilar inquebrantable, la trampa de la autosuficiencia extrema y el alivio profundo que surge al permitirte recibir cuidado.",
    category: "Límites y autocuidado",
    date: "1 Sep 2026",
    readTime: "6 min de lectura",
    imageUrl: "/src/assets/images/blog_exhaustion_strong_1792597409060.jpg",
    content: [
      "Eres la persona a la que todos llaman cuando las cosas se complican. Resuelves las crisis familiares, sostienes las metas laborales, organizas los detalles y nunca dejas caer una sola pelota en el aire. Desde afuera, todos admiran tu aparente temple de acero.",
      "Pero a puerta cerrada, cuando las luces se apagan, sientes un agotamiento que ningún fin de semana de sueño logra reparar. Es el cansancio profundo de quien nunca se ha sentido con el derecho de derrumbarse, de mostrar vulnerabilidad o de pedir que alguien más se haga cargo.",
      "La autosuficiencia extrema (hiperindependencia) rara vez es una simple preferencia de personalidad; con frecuencia es una respuesta adaptativa al trauma relacional. Quien aprendió en su historia que nadie vendría a su rescate o que sus necesidades causaban conflicto asume la armadura de la fortaleza como escudo defensivo.",
      "El costo oculto de esta postura es la soledad crónica. Puedes estar rodeada de personas queridas y, sin embargo, sentirte completamente invisible en tus propias fragilidades.",
      "Sanar implica arriesgarse a soltar el control poco a poco, reconociendo que tu valía no radica exclusivamente en tu utilidad para otros. Mereces un espacio donde no tengas que ser el sostén de nadie, sino la persona que es amorosamente sostenida.",
    ],
  },
];
