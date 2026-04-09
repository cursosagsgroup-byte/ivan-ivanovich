"use client";
import React, { useEffect, useState, useRef } from 'react';
import './contravigilancia.css';


export default function ContravigilanciasPres() {
    const [cdDays, setCdDays] = useState('--');
    const [cdHours, setCdHours] = useState('--');
    const [cdMins, setCdMins] = useState('--');
    const [cdSecs, setCdSecs] = useState('--');
    const [openMod, setOpenMod] = useState<number | null>(null);
    const [isStickyVisible, setIsStickyVisible] = useState(false);
    const [progressWidth, setProgressWidth] = useState('100%');

    useEffect(() => {
        const target = new Date('2026-05-05T09:00:00-06:00').getTime();
        const tick = () => {
            const diff = Math.max(0, target - Date.now());
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCdDays(String(d).padStart(2,'0'));
            setCdHours(String(h).padStart(2,'0'));
            setCdMins(String(m).padStart(2,'0'));
            setCdSecs(String(s).padStart(2,'0'));
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTimeout(() => setProgressWidth('0%'), 600);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.08 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsStickyVisible(window.scrollY > 700);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMod = (index: number) => {
        if (openMod === index) setOpenMod(null);
        else setOpenMod(index);
    };

    return (
        <div className="contravigilancia-page" style={{ background: '#080808', color: '#EFEFEF', fontFamily: '\'Inter\', sans-serif' }}>
{/*  ── COUNTDOWN TOP BAR ──  */}
  <div className="countdown-bar">
    <div className="countdown-inner">
      <span className="countdown-label">El curso inicia en</span>
      <div className="countdown-timer">
        <div className="time-unit"><span className="time-number" id="cdDays">{cdDays}</span><div className="time-label">Días</div></div>
        <span className="time-sep">:</span>
        <div className="time-unit"><span className="time-number" id="cdHours">{cdHours}</span><div className="time-label">Horas</div></div>
        <span className="time-sep">:</span>
        <div className="time-unit"><span className="time-number" id="cdMins">{cdMins}</span><div className="time-label">Min</div></div>
        <span className="time-sep">:</span>
        <div className="time-unit"><span className="time-number" id="cdSecs">{cdSecs}</span><div className="time-label">Seg</div></div>
      </div>
    </div>
  </div>

  {/*  ── ANNOUNCE BAR ──  */}
  <div className="announce-bar">
    Ciudad de México<span>·</span>5 y 6 de Mayo<span>·</span>Solo 12 lugares disponibles
  </div>

  {/*  ── NAV ──  */}
  <nav className="nav">
    <img src="https://ivanivanovich.com/_next/image?url=%2Flogo.png&w=384&q=75" alt="Ivan Ivanovich Academy" className="nav-logo"/>
    <div className="nav-right">
      <a href="#temario" className="nav-link">Temario</a>
      <a href="https://wa.me/525540612974?text=Quiero%20asegurar%20mi%20lugar%20en%20el%20curso%20de%20Contravigilancia%20Ejecutiva" target="_blank" className="nav-cta">
        Asegurar lugar &rarr;
      </a>
    </div>
  </nav>

  {/*  ── HERO ──  */}
  <section className="hero">
    <div className="hero-bg"></div>
    <div className="hero-overlay"></div>
    <div className="hero-content reveal">

      <p className="hero-tagline">Ellos ya te están observando. Tú aún no lo sabes.</p>

      <h1>Curso de<br />Contravigilancia en<br /><em>Protección Ejecutiva</em></h1>

      <div className="hero-info-row">
        <div className="info-item">
          <span className="info-label">Fecha</span>
          <span className="info-value">5 y 6 de Mayo</span>
        </div>
        <div className="info-item">
          <span className="info-label">Ciudad</span>
          <span className="info-value">CDMX</span>
        </div>
        <div className="info-item">
          <span className="info-label">Cupos disponibles</span>
          <span className="info-value gold">12 lugares</span>
        </div>
        <div className="info-item">
          <span className="info-label">Inversión</span>
          <span className="info-value price">$14,800 MXN</span>
        </div>
      </div>

      <p className="hero-body">
        El conocimiento que estás a punto de adquirir no está en ningún manual público. No se enseña en academias convencionales. Viene de tres décadas de operaciones reales en los escenarios más hostiles del mundo. Y por primera vez, está disponible para ti.
      </p>

      <div className="hero-actions">
        <a href="https://wa.me/525540612974?text=Quiero%20asegurar%20mi%20lugar%20en%20el%20curso%20de%20Contravigilancia%20Ejecutiva" target="_blank" className="btn-main">Asegurar mi lugar ahora &rarr;</a>
        <a href="#temario" className="btn-ghost">Ver el temario completo</a>
      </div>

      <div className="cupos-widget">
        <div className="cupos-header">
          <span className="cupos-label">Disponibilidad del grupo</span>
          <span className="cupos-count">12 / 12 disponibles</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" id="progressFill" style={{ width: progressWidth }}></div>
        </div>
        <p className="cupos-foot"><strong>12 lugares disponibles.</strong> El grupo cierra cuando se llena.</p>
      </div>

    </div>
  </section>

  {/*  ── GALLERY STRIP ──  */}
  <div className="gallery-strip">
    <div className="gallery-item">
      <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Fnueva-seccion%2Fmain.jpg&w=1920&q=75" alt="Entrenamiento Ivan Ivanovich" loading="lazy"/>
    </div>
    <div className="gallery-item">
      <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Fnueva-seccion%2Fgallery-1.jpg&w=1200&q=75" alt="Práctica de campo" loading="lazy"/>
    </div>
    <div className="gallery-item">
      <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Fnueva-seccion%2Fgallery-2.jpg&w=1200&q=75" alt="Entrenamiento en equipo" loading="lazy"/>
    </div>
    <div className="gallery-item">
      <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Fnueva-seccion%2Fgallery-3.jpg&w=1200&q=75" alt="Ejercicios tácticos" loading="lazy"/>
    </div>
  </div>

  {/*  ── EL PROBLEMA ──  */}
  <div className="section reveal" style={{background: 'var(--surface)', }}>
    <div className="section-inner">
      <div className="eyebrow">El problema</div>
      <h2 className="display">El modelo de protección que te enseñaron está diseñado para <em>reaccionar.</em></h2>
      <p className="body">Reaccionar significa que el daño ya ocurrió.</p>
      <p className="body">La protección ejecutiva tradicional — escoltas de cerca, vehículos blindados, acciones reactivas — tiene una limitación fatal: espera a que el ataque ocurra para responder. Pero el agresor no ataca cuando tú estás listo. Ataca cuando la ventaja ya es completamente suya.</p>
      <p className="body">Porque mientras tú reaccionas, él ya pasó meses observando. Identificó tu ruta crítica. Tu horario crítico. Tu punto de máxima vulnerabilidad.</p>
      <p className="body">Las «peligrosas fantasías sobre armas y reacción» — como las llama Ivan Ivanovich — no salvan vidas. La detección temprana de la vigilancia hostil, sí.</p>

      <div className="prob-list">
        <div className="prob-item">
          <div className="prob-n">01</div>
          <div className="prob-text">
            <h4>Protección reactiva</h4>
            <p>Responde cuando el ataque ya ocurrió. El daño es inevitable en este modelo.</p>
          </div>
        </div>
        <div className="prob-item">
          <div className="prob-n">02</div>
          <div className="prob-text">
            <h4>Punto ciego crítico</h4>
            <p>Sin Contravigilancia, el equipo opera sin detectar la fase de preparación del agresor.</p>
          </div>
        </div>
        <div className="prob-item">
          <div className="prob-n">03</div>
          <div className="prob-text">
            <h4>El agresor tiene meses de ventaja</h4>
            <p>El criminal planifica durante meses. El escolta reacciona en segundos. La matemática no funciona.</p>
          </div>
        </div>
        <div className="prob-item">
          <div className="prob-n">04</div>
          <div className="prob-text">
            <h4>La solución existe</h4>
            <p>La detección temprana de vigilancia hostil neutraliza el ataque antes de que ocurra.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/*  ── DOCTRINA ──  */}
  <div className="doctrina-wrap reveal">
    <div className="doctrina-inner">
      <div className="quote-big">
        <span>«Tenemos que saber quiénes son, como ellos saben quiénes somos.</span>
        <span>Tenemos que saber dónde están, como ellos saben dónde estamos.</span>
        <span>Tenemos que seguirlos, como ellos nos siguen a nosotros.</span>
        <span>Tenemos que sorprenderlos, como ellos nos quieren sorprender a nosotros.»</span>
      </div>
      <div className="quote-src">
        <div className="quote-src-line"></div>
        <div className="quote-src-name">Ivan Ivanovich</div>
      </div>
      <div className="doctrina-note">
        Esta no es una filosofía defensiva. Es una declaración de guerra táctica.<br />
        El operador que entiende esto deja de ser el objetivo. <strong>Y se convierte en la amenaza que el agresor no vio venir.</strong>
      </div>
    </div>
  </div>

  <div className="divider"></div>

  {/*  ── LA EVIDENCIA ──  */}
  <div className="section reveal" style={{background: 'var(--black)', }}>
    <div className="section-inner">
      <div className="eyebrow">La evidencia</div>
      <h2 className="display">Esto no es teoría.<br />Está documentado en casos reales que ocurrieron en México.</h2>
      <p className="body">Casos reales. Víctimas reales. Un denominador común confirmado por las investigaciones: <strong>todos habían sido vigilados durante meses antes del ataque, sin que nadie lo detectara.</strong></p>

      <div className="ev-cases">
        <div className="ev-case">
          <div className="ev-case-name">Omar García Harfuch</div>
          <div className="ev-case-year">Atentado · 2020</div>
        </div>
        <div className="ev-case">
          <div className="ev-case-name">Eduardo Beaven</div>
          <div className="ev-case-year">Asesinato · 2021</div>
        </div>
        <div className="ev-case">
          <div className="ev-case-name">Ciro Gómez Leyva</div>
          <div className="ev-case-year">Ataque · 2022</div>
        </div>
      </div>

      <p className="body">Un sistema de Contravigilancia activo los habría identificado en esa fase. <strong>El ataque nunca habría ocurrido.</strong></p>
      <p className="body">Y la evidencia más poderosa no viene de un experto. Viene de una ex criminal.</p>

      <div className="testimony testimony-with-photo">
        <img
          src="https://cdn.wionews.com/sites/default/files/2018/11/19/75361-serbian-former-jewel-thief.jpg"
          alt="Olivera Ćirković"
          className="testimony-photo"
          loading="lazy"
        />
        <div className="testimony-text">
          <p>Olivera Ćirković, ex miembro de los <em>Pink Panthers</em>, confesó que los agentes armados nunca la disuadieron. Pero si alguien anotaba la matrícula de su vehículo durante la vigilancia — abandonaba a la víctima de inmediato.<br /><br />
          Durante la vigilancia hostil, el criminal no puede usar disfraz. Sus vehículos son identificables. Es su momento más vulnerable.<br /><br />
          Fue en esa fase donde finalmente fue arrestada.</p>
          <span className="testimony-credit">Olivera Ćirković · Ex miembro · Los Pink Panthers</span>
        </div>
      </div>

      <p className="body"><strong>Los criminales de alto perfil no le temen a tus armas. Le temen a ser detectados.</strong></p>
    </div>
  </div>

  <div className="divider"></div>

  {/*  ── AUTORIDAD ──  */}
  <div className="section autoridad-wrap reveal">
    <div className="section-inner" style={{maxWidth: '1100px', }}>
      <div className="autoridad-grid">
        <div className="autoridad-image">
          <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Flanding-pe%2Fivan-pensando.jpg&w=1200&q=75" alt="Ivan Ivanovich" loading="lazy"/>
        </div>
        <div>
          <div className="eyebrow">El instructor</div>
          <h2 className="display">No aprenderás de alguien que leyó sobre seguridad. Aprenderás de alguien que operó donde el error costaba vidas.</h2>
          <p className="body">Ivan Ivanovich no construyó su reputación en salones de clase.</p>
          <p className="body">La construyó en campo. En <strong>Serbia. En Bosnia. En Macedonia.</strong> Durante la guerra de los Balcanes, cuando la Contravigilancia no era una asignatura — era la diferencia entre sobrevivir o no.</p>
          <p className="body">Desde el año 2000 en México, ha formado a cientos de operadores de élite y desarrolló la doctrina que hoy redefine la protección ejecutiva en Latinoamérica: los <strong>Anillos del Tiempo</strong> — un sistema que desplaza el modelo reactivo por uno anticipatorio, donde la amenaza se neutraliza antes de llegar al ejecutivo.</p>

          <div className="creds">
            <div className="cred cred-highlight">
              <div className="cred-icon">⚔️</div>
              <h4>Infantería de Marina · España</h4>
              <p>Único instructor civil y extranjero en la historia en capacitar al Ejército Español en Protección Ejecutiva.</p>
            </div>
            <div className="cred">
              <div className="cred-icon">🌍</div>
              <h4>Top 9 mundial</h4>
              <p>Una de las 9 mejores escuelas de Protección Ejecutiva en el mundo. Revista EP Wired.</p>
            </div>
            <div className="cred">
              <div className="cred-icon">🏆</div>
              <h4>Top 100 en México</h4>
              <p>Uno de los 100 profesionales más influyentes en seguridad privada. Revista Seguridad en América.</p>
            </div>
            <div className="cred">
              <div className="cred-icon">📖</div>
              <h4>Bestseller #1</h4>
              <p>"Protección Ejecutiva en el Siglo XXI: La Nueva Doctrina" — #1 en ventas al publicarse.</p>
            </div>
          </div>

          <p className="body">Cuando el Ejército Español necesitó elevar su estándar operativo, llamaron a Ivan.<br /><strong>Ahora tienes dos días para formarte directamente con él.</strong></p>
        </div>
      </div>
    </div>
  </div>

  <div className="divider"></div>

  {/*  ── EL CONOCIMIENTO ──  */}
  <div className="section conocimiento-wrap reveal">
    <div className="section-inner">
      <div className="eyebrow">El conocimiento</div>
      <h2 className="display">La Contravigilancia es la medida más efectiva y <em>menos empleada</em> en la protección ejecutiva.</h2>
      <p className="body">No porque sea difícil. Porque casi nadie la enseña bien.</p>

      <div className="conocimiento-highlight">
        <p>Mientras la protección tradicional actúa <strong>a la derecha del impacto</strong> — después de que el ataque ocurrió — la Contravigilancia opera <strong>a la izquierda del impacto</strong>: en la fase de observación y preparación del agresor, cuando aún puede ser detectado, disuadido e identificado.</p>
      </div>

      <p className="body">Es en esa fase donde el criminal es más vulnerable. Es en esa fase donde el operador entrenado tiene la mayor ventaja. Y es exactamente esa fase la que este curso te enseña a dominar.</p>
      <p className="body">Este conocimiento viene de las unidades de inteligencia y contraespionaje más efectivas del mundo. En este curso, <strong>se convierte en tuyo.</strong></p>
    </div>
  </div>

  <div className="divider"></div>

  {/*  ── TRANSFORMACIÓN ──  */}
  <div className="section transform-wrap reveal">
    <div className="section-inner">
      <div className="eyebrow">Tu transformación</div>
      <h2 className="display">Hay escoltas.<br />Y hay operadores que <em>controlan</em> el entorno antes de que la amenaza exista.</h2>
      <p className="body">Después de estos dos días, no serás el mismo profesional.</p>

      <div className="transform-items">
        <div className="t-item">
          <p>Detectarás <strong>vigilancia hostil</strong> antes de que tu equipo sepa que existe.</p>
          <div className="t-arrow">→</div>
        </div>
        <div className="t-item">
          <p>Identificarás la <strong>ruta crítica, el horario crítico y el perímetro crítico</strong> de cada operativo.</p>
          <div className="t-arrow">→</div>
        </div>
        <div className="t-item">
          <p>Operarás bajo observación <strong>sin revelar que la descubriste</strong> — conservando la ventaja táctica.</p>
          <div className="t-arrow">→</div>
        </div>
        <div className="t-item">
          <p>Diseñarás rutas de Contravigilancia que <strong>convierten al depredador en la presa.</strong></p>
          <div className="t-arrow">→</div>
        </div>
        <div className="t-item">
          <p>Tomarás decisiones con la misma doctrina que usan <strong>las unidades de élite a nivel global.</strong></p>
          <div className="t-arrow">→</div>
        </div>
      </div>

      <div className="transform-big">
        <p>Dejarás de proteger en el momento del peligro.<br /><span>Empezarás a eliminar el peligro antes de que llegue.</span></p>
      </div>

      <p className="body" style={{marginTop: '32px', }}>Eso es lo que separa a un escolta de un protector ejecutivo de élite. <strong>Eso es exactamente en lo que te vas a convertir.</strong></p>
    </div>
  </div>

  {/*  ── TEMARIO ──  */}
  <div className="section temario-wrap reveal" id="temario">
    <div className="section-inner">
      <div className="eyebrow">Temario completo</div>
      <h2 className="display">Lo que aprenderás.<br />Sin filtros.</h2>
      <p className="body">5 módulos de formación teórico-práctica basados en doctrina de inteligencia y operaciones de élite.</p>

      <div className="modules">
        <div className={`mod ${openMod === 1 ? "open" : ""}`} onClick={() => toggleMod(1)}>
          <div className="mod-head">
            <div className="mod-num">01</div>
            <div className="mod-title">Inteligencia estratégica</div>
            <div className="mod-toggle">+</div>
          </div>
          <div className="mod-body">
            <ul className="mod-list">
              <li>Por qué la Contravigilancia es la medida más poderosa en Protección Ejecutiva</li>
              <li>Por qué los criminales le temen más a la Contravigilancia que a las armas</li>
              <li>Orígenes de las técnicas de Detección y Manejo de Vigilancia Hostil</li>
              <li>De las agencias de espionaje y contraespionaje a la Protección Ejecutiva</li>
              <li>Tipos de vigilancia hostil según el perfil de amenaza</li>
            </ul>
          </div>
        </div>

        <div className={`mod ${openMod === 2 ? "open" : ""}`} onClick={() => toggleMod(2)}>
          <div className="mod-head">
            <div className="mod-num">02</div>
            <div className="mod-title">Detección y Manejo de Vigilancia Hostil (GVT)</div>
            <div className="mod-toggle">+</div>
          </div>
          <div className="mod-body">
            <ul className="mod-list">
              <li>Cómo piensa y opera el agresor durante la fase de vigilancia</li>
              <li>Autodetección: cómo identificar que estás bajo vigilancia hostil sin revelarlo</li>
              <li>Medidas pasivas, activas y evasivas</li>
              <li>El Principio TCDC</li>
              <li>La regla táctica fundamental: por qué nunca debes mostrar que detectaste la vigilancia</li>
              <li>Diferencia operativa entre ser vigilado y ser perseguido</li>
            </ul>
          </div>
        </div>

        <div className={`mod ${openMod === 3 ? "open" : ""}`} onClick={() => toggleMod(3)}>
          <div className="mod-head">
            <div className="mod-num">03</div>
            <div className="mod-title">Operaciones de Contravigilancia</div>
            <div className="mod-toggle">+</div>
          </div>
          <div className="mod-body">
            <ul className="mod-list">
              <li>Composición y roles del equipo de Contravigilancia</li>
              <li>Planeación de rutas de Contravigilancia</li>
              <li>Cómo definir y operar en puntos de detección de vigilancia hostil</li>
              <li>Cuándo y cómo involucrar al ejecutivo protegido</li>
            </ul>
          </div>
        </div>

        <div className={`mod ${openMod === 4 ? "open" : ""}`} onClick={() => toggleMod(4)}>
          <div className="mod-head">
            <div className="mod-num">04</div>
            <div className="mod-title">Las 4 fases operativas</div>
            <div className="mod-toggle">+</div>
          </div>
          <div className="mod-body">
            <ul className="mod-list">
              <li>Detección</li>
              <li>Contra seguimiento: convirtiendo al depredador en la presa</li>
              <li>Identificación</li>
              <li>Desactivación de la amenaza detectada e identificada</li>
            </ul>
          </div>
        </div>

        <div className={`mod ${openMod === 5 ? "open" : ""}`} onClick={() => toggleMod(5)}>
          <div className="mod-head">
            <div className="mod-num">05</div>
            <div className="mod-title">Aplicación para todo el equipo</div>
            <div className="mod-toggle">+</div>
          </div>
          <div className="mod-body">
            <ul className="mod-list">
              <li>Técnicas de detección para el agente de protección</li>
              <li>Técnicas de detección para el chofer de seguridad</li>
              <li>Medidas pasivas de autodetección: fase fija, en vehículo y a pie</li>
              <li>Medidas activas de autodetección: fase fija, en vehículo y a pie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/*  ── PRÁCTICA EN CAMPO ──  */}
  <div className="section practica-wrap reveal">
    <div className="section-inner">
      <div className="eyebrow">Práctica en campo</div>
      <h2 className="display">Dos días que cambian lo que eres como operador.</h2>
      <p className="body">La mayoría de los cursos terminan en el salón. Este termina en el campo.</p>
      <p className="body">Aquí la práctica no es un ejercicio genérico. Es una recreación basada en ataques reales que han ocurrido en México.</p>
      <p className="body">Los participantes se dividen en dos equipos:</p>
    </div>

    <div className="practica-grid" style={{maxWidth: '100%', marginTop: '40px', }}>
      <div className="practica-card">
        <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Flanding-pe%2Fpersuasion-1.jpg&w=1200&q=75" alt="Equipo A" loading="lazy"/>
        <div className="practica-overlay">
          <div className="p-tag">Día 1 · Equipo A</div>
          <h3>Reconstrucción del escenario de amenaza</h3>
          <p>Basándose en casos documentados, mapean las vulnerabilidades, los patrones de vigilancia hostil y los puntos críticos que los agresores históricamente han explotado. El objetivo: entender la amenaza desde adentro para poder anticiparla.</p>
        </div>
      </div>
      <div className="practica-card">
        <img src="https://ivanivanovich.com/_next/image?url=%2Fimages%2Flanding-pe%2Faction-5.jpg&w=1200&q=75" alt="Equipo B" loading="lazy"/>
        <div className="practica-overlay">
          <div className="p-tag">Día 1 · Equipo B</div>
          <h3>Operación de Contravigilancia</h3>
          <p>Su misión es una sola: detectar la vigilancia hostil en su fase de preparación y neutralizar el ataque antes de que el protegido corra cualquier riesgo.</p>
        </div>
      </div>
    </div>

    <div className="inversion">
      <p>Al día siguiente, los roles se invierten.</p>
    </div>

    <div className="practica-extra">
      <div className="section-inner">
        <p className="body">Porque para anticipar una amenaza, primero tienes que entender cómo se construye.</p>
        <p className="body">Al final de estos dos días habrás analizado la amenaza desde ambos ángulos, operado bajo la misma presión táctica de un operativo real, y cerrado los puntos ciegos que los agresores buscan explotar.</p>
        <p className="body" style={{marginBottom: '0', }}><strong>Y te irás con algo más.</strong></p>
      </div>
    </div>

    <div className="cert">
      <div className="cert-icon-wrap">📋</div>
      <div>
        <h4>Certificado avalado por la Secretaría del Trabajo</h4>
        <p>Un respaldo institucional que acredita tu formación ante cualquier empresa, cliente o corporativo que exija el más alto estándar en protección ejecutiva. <span>No solo serás mejor operador. Tendrás el papel que lo demuestra.</span></p>
      </div>
    </div>
  </div>

  <div className="divider"></div>

  {/*  ── PARA EMPRESAS ──  */}
  <div className="section empresas-wrap reveal">
    <div className="section-inner">
      <div className="eyebrow">Para empresas</div>
      <h2 className="display">Si tienes un equipo de seguridad, esto es lo que necesitas entender.</h2>
      <p className="body">Tienes escoltas. Bien entrenados. Bien equipados.</p>
      <p className="body">Pero si ninguno fue formado en Contravigilancia, están operando con un punto ciego que el agresor ya conoce y está dispuesto a explotar.</p>
      <p className="body">No se trata de contratar más personal. <strong>Se trata de elevar el estándar operativo del equipo que ya tienes.</strong></p>
      <p className="body">Un solo operador formado en Contravigilancia activa el Anillo de Tiempo más poderoso de toda la operación: el que neutraliza la amenaza meses antes de que llegue al ejecutivo.</p>
      <p className="body">Forma a tu equipo con el mismo estándar que el Ejército Español. <strong>Esa decisión no tiene precio. Pero tiene fecha límite.</strong></p>
      <div style={{marginTop: '40px', }}>
        <a href="https://wa.me/525540612974?text=Quiero%20inscribir%20a%20mi%20equipo%20al%20curso%20de%20Contravigilancia%20Ejecutiva" target="_blank" className="btn-main">Inscribir a mi equipo &rarr;</a>
      </div>
    </div>
  </div>

  {/*  ── CTA FINAL ──  */}
  <div className="cta-wrap reveal" id="cta">
    <div className="cta-inner">
      <div className="cta-eyebrow">Solo 12 lugares · Sin excepciones</div>
      <h2 className="cta-h">12 lugares.<br />Una sola fecha.<br />Sin excepciones.</h2>
      <p className="cta-sub">Este no es un seminario masivo. Es una formación presencial de alto nivel diseñada intencionalmente para un grupo reducido — porque la calidad del entrenamiento lo exige.</p>

      <div className="urgency-line">
        Cada edición anterior se ha llenado antes de la fecha. Y cuando los lugares se agotan, no hay lista de espera.<br /><br />
        <strong>Cada día que pasa sin este conocimiento es un día en que la vigilancia hostil puede estar ocurriendo — sin que nadie en tu equipo lo sepa.</strong><br /><br />
        No esperes a que el cupo se cierre para tomar la decisión.
      </div>

      <div className="price-row">
        <span className="price-currency">$</span>
        <span className="price-amount">14,800</span>
        <span className="price-period">MXN</span>
      </div>
      <div className="price-note">+ IVA en caso de requerir factura</div>

      <div className="cta-details-row">
        <div className="cta-d">
          <div className="cta-d-lbl">Curso</div>
          <div className="cta-d-val">Contravigilancia en Protección Ejecutiva</div>
        </div>
        <div className="cta-d">
          <div className="cta-d-lbl">Fecha</div>
          <div className="cta-d-val">5 y 6 de Mayo 2026</div>
        </div>
        <div className="cta-d">
          <div className="cta-d-lbl">Modalidad</div>
          <div className="cta-d-val">Presencial · CDMX</div>
        </div>
      </div>

      <a href="https://wa.me/525540612974?text=Quiero%20asegurar%20mi%20lugar%20en%20el%20curso%20de%20Contravigilancia%20Ejecutiva%205-6%20Mayo" target="_blank" className="btn-cta">Asegurar mi lugar hoy &rarr;</a>
      <p className="cta-urgency"><strong>⚠ Solo 12 lugares disponibles.</strong> Una vez agotados, no hay segunda oportunidad hasta la próxima edición.</p>
      <p className="cta-ws">¿Tienes preguntas? Escríbenos por WhatsApp. Respondemos solo a profesionales serios.</p>
      <div className="cta-closing">La misión empieza ahora.</div>
    </div>
  </div>

  {/*  ── FOOTER ──  */}
  <footer>
    <div className="footer-logo">© 2026 Ivan Ivanovich Executive Protection Academy</div>
    <div className="footer-links">
      <a href="https://ivanivanovich.com" target="_blank">ivanivanovich.com</a>
      <a href="mailto:contacto@ivanivanovich.com">contacto@ivanivanovich.com</a>
    </div>
  </footer>

  {/*  ── STICKY CTA BAR ──  */}
  <div className={`sticky-cta ${isStickyVisible ? "visible" : ""}`} id="stickyCta">
    <div className="sticky-info">
      <span className="sticky-dates">5 – 6 Mayo · CDMX</span>
      <span className="sticky-price">$14,800 MXN</span>
      <span className="sticky-cupos">⚡ Solo 4 lugares</span>
    </div>
    <a href="https://wa.me/525540612974?text=Quiero%20asegurar%20mi%20lugar%20en%20el%20curso%20de%20Contravigilancia%20Ejecutiva" target="_blank" className="btn-main" style={{padding: '12px 22px', fontSize: '11px', }}>
      Asegurar lugar &rarr;
    </a>
  </div>
        </div>
    );
}
