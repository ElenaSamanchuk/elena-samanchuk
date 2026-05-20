export function initWebGLBackground(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) return () => undefined;

  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    float blob(vec2 p, vec2 center, float radius) {
      return radius / (length(p - center) + radius * 0.85);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 p = uv - 0.5;
      p.x *= u_resolution.x / u_resolution.y;

      float t = u_time * 0.11;
      vec2 c1 = vec2(sin(t * 0.7) * 0.28, cos(t * 0.55) * 0.22);
      vec2 c2 = vec2(cos(t * 0.45 + 1.2) * 0.32, sin(t * 0.62 + 0.8) * 0.26);
      vec2 c3 = vec2(sin(t * 0.35 + 2.1) * 0.24, cos(t * 0.48 + 1.6) * 0.3);

      float field = blob(p, c1, 0.34) + blob(p, c2, 0.3) + blob(p, c3, 0.28);
      field *= 0.22;

      vec3 cA = vec3(0.39, 0.4, 0.95);
      vec3 cB = vec3(0.92, 0.28, 0.58);
      vec3 col = mix(cA, cB, uv.x + sin(t + p.y * 2.0) * 0.06) * field;
      float alpha = clamp(field * 0.95, 0.0, 0.28);

      gl_FragColor = vec4(col, alpha);
    }
  `;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return () => undefined;

  const program = gl.createProgram();
  if (!program) return () => undefined;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => undefined;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");

  let animationId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const width = Math.floor(window.innerWidth * dpr);
    const height = Math.floor(window.innerHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    gl.viewport(0, 0, width, height);
  };

  const render = (time: number) => {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    animationId = window.requestAnimationFrame(render);
  };

  resize();
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  animationId = window.requestAnimationFrame(render);

  window.addEventListener("resize", resize);

  return () => {
    window.cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
  };
}
