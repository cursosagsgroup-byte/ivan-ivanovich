
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start publishing post...');

    // 1. Find an author (Admin preferred)
    const author = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!author) {
        console.error('No admin user found to assign as author.');
        process.exit(1);
    }

    console.log(`Found author: ${author.name} (${author.email})`);

    // 2. Prepare content
    const title = 'Más armas, más patrullas… y más muertos: el asesinato de Zapopan';
    const slug = 'mas-armas-mas-patrullas-y-mas-muertos-el-asesinato-de-zapopan';
    const excerpt = 'El asesinato del empresario Alberto Prieto Valencia en Zapopan confirma, una vez más, que la protección ejecutiva basada exclusivamente en reacción armada y vehículos escolta es ineficaz.';

    const content = `
    <p>El empresario Alberto Prieto Valencia fue asesinado el 29 de diciembre de 2025, alrededor de las 10:30 a.m., en una emboscada perpetrada en Zapopan, Jalisco, en las inmediaciones de las avenidas Topacio y Cruz del Sur.</p>
    
    <p>De acuerdo con reportes periodísticos, aproximadamente 25 sicarios, distribuidos en al menos siete vehículos, interceptaron su Lamborghini Urus color naranja, abriendo fuego de manera coordinada contra el empresario, su hija de 16 años, y entre cuatro y seis escoltas armados que lo acompañaban en dos camionetas tipo pickup. El enfrentamiento duró cerca de 20 minutos, con más de 400 casquillos percutidos en la escena. El empresario, su hija y uno de los escoltas perdieron la vida, mientras que cuatro escoltas más resultaron heridos.</p>
    
    <p>El ataque se inició cuando una camioneta negra le cerró el paso al convoy en el cruce con la calle Brillante, y los disparos empezaron simultáneamente desde ambos lados: un grupo por la derecha y otro oculto por la izquierda en la calle Barra. Los atacantes huyeron sin intervención policial.</p>
    
    <p><strong>Una vez más, este caso confirma que la protección ejecutiva basada exclusivamente en reacción armada y vehículos escolta es ineficaz.</strong></p>
    
    <p>De este atentado se desprenden varias lecciones fundamentales para salvar vidas de los protegidos en el futuro:</p>
    
    <ol>
      <li><strong>Durante el traslado, son los vehículos blindados —y no las armas— los que reducen el riesgo.</strong> De poco sirve sostener una balacera de 20 minutos si los protegidos fallecen en los primeros instantes del ataque.</li>
      <li><strong>El protegido no debe conducir el vehículo principal.</strong> La protección exige coordinación avanzada, lectura del entorno, comunicación táctica y toma de decisiones bajo estrés, competencias para las cuales el protegido no está entrenado. La resistencia de muchos ejecutivos a delegar esta función es un problema recurrente; por ello, resulta indispensable dominar técnicas de persuasión y control cognitivo, que explico en detalle en este artículo: <a href="https://ivanivanovich.com/blog/como-hacer-para-que-los-ejecutivos-entiendan-claves-de-la-persuasion-en-la-proteccion-ejecutiv" target="_blank" rel="noopener noreferrer">Cómo hacer para que los ejecutivos entiendan: claves de la persuasión en la protección ejecutiva</a>.</li>
      <li><strong>Para montar una emboscada de esta magnitud, el objetivo debió ser observado durante semanas o incluso meses.</strong> El hecho de que los escoltas no detectaran esta fase previa evidencia una carencia grave de capacitación y de aplicación real de técnicas de contravigilancia. Este punto se analiza con mayor profundidad en el siguiente video: <a href="https://youtu.be/_rUN2VjNFPw?feature=shared" target="_blank" rel="noopener noreferrer">Ver video sobre contravigilancia</a>.</li>
      <li><strong>La clave: Alerta Temprana.</strong> Repeler una emboscada sorpresiva de 20 sicarios fuertemente armados es extremadamente difícil. Detectarla con anticipación, en cambio, es relativamente sencillo, si se cuenta con un sistema de Alerta Temprana. Es prácticamente imposible ocultar a 20 hombres armados con armas largas y múltiples vehículos en un lugar y horario crítico de tu ruta, siempre que existe equipo de Alerta Temprana desplegado con antelación observando, analizando y validando puntos críticos. Un ejemplo claro de este principio fue el segundo intento de atentado contra Donald Trump en el campo de golf, en 2024 donde solo dos agentes adelantados lograron detectar y prevenir la amenaza, algo que decenas de agentes no consiguieron detener durante el atentado en Butler.</li>
    </ol>
    
    <p>Con este lamentable caso, ya suman 33 protegidos asesinados y 44 escoltas armados muertos en México desde agosto de 2022.</p>
    
    <p>¿Hasta cuándo vamos a seguir ignorando que la protección ejecutiva no consiste en acompañantes armados siguiendo un vehículo, sino en un sistema integral de anticipación que desactiva las fases de preparación del ataque, en lugar de intentar reaccionar cuando la fase de ejecución ya está en curso?</p>
    
    <p>Solo así podremos construir una profesión realmente más segura, tanto para los protegidos como para quienes tienen la responsabilidad de protegerlos.</p>
  `;

    // 3. Create Post
    // Check if slug exists first
    const existing = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (existing) {
        console.log('Post already exists, updating...');
        await prisma.blogPost.update({
            where: { slug },
            data: {
                title,
                content,
                excerpt,
                image: '/images/blog/asesinato-zapopan-2025.jpg',
                published: true,
                pinned: true, // Make it pinned as it is breaking news/important
                language: 'es',
                authorId: author.id,
            },
        });
        console.log('Post updated successfully.');
    } else {
        console.log('Creating new post...');
        await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                image: '/images/blog/asesinato-zapopan-2025.jpg',
                published: true,
                pinned: true,
                language: 'es',
                authorId: author.id,
            },
        });
        console.log('Post created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
