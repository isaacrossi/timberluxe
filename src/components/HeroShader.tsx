"use client";

import React, { useEffect, useRef } from "react";

const VERTEX_SHADER_SOURCE = `
  precision highp float;
  attribute vec2 position;
  varying vec2 v_texcoord;
  void main() {
    v_texcoord = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float seed;

  varying vec2 v_texcoord;

  #define NUM_OCTAVES 5

  // Random number generator for grain
  float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  // 2D random gradient vector for Perlin noise
  vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // 2D Perlin Noise (eliminates square patterns, creates smooth waves)
  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      
      // Cubic Hermite spline interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(
          mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)), 
              dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
          mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)), 
              dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y
      );
  }

  // Fractional Brownian Motion using Perlin Noise
  float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * (noise(x) * 0.5 + 0.5); // scale Perlin noise to [0, 1] range
          x = rot * x * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  // Rotation matrix for 2D
  mat2 rotation2d(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
  }

  void main(void) {
      vec2 uv = v_texcoord;

      // find the distance between mouse and points
      vec2 mouse = u_mouse / u_resolution;
      float dist = distance(uv, mouse);
      float strength = smoothstep(0.5, 0.0, dist);
      
      // Define a static dark woodland green color combo (dark enough to meet WCAG AAA standards for white text)
      vec4 color1 = vec4(0.02, 0.10, 0.04, 1.0); // Deep forest black-green
      vec4 color2 = vec4(0.07, 0.20, 0.10, 1.0); // Dark pine/moss green
      
      // Grain effect
      float grain = rand(uv) * mix(0.1, 0.01, strength);
      
      // Movement for fbm
      vec2 movement = vec2(u_time * 0.01, u_time * -0.01);
      movement *= rotation2d(u_time * 0.005);
      
      // Apply fractional Brownian motion
      float f = fbm(uv + movement + seed);
      f *= 10.0;
      f += grain;
      f += u_time * 0.2;
      f = fract(f);
      
      // Create a smooth mixing factor
      float gap = mix(0.5, 0.01, strength);
      float mixer = smoothstep(0.0, gap, f) - smoothstep(1.0 - gap, 1.0, f);
    
      // Mix the colors based on the mixer
      vec4 color = mix(color1, color2, mixer);
      
      // Output the final color
      gl_FragColor = color;
  }
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.error("WebGL not supported in this browser.");
      return;
    }

    // Helper to compile shaders
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create and link program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Setup geometry buffer (two triangles covering the clip space)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const seedLoc = gl.getUniformLocation(program, "seed");

    // Initialize seed
    const seedValue = Math.random();
    gl.uniform1f(seedLoc, seedValue);

    // State for size and mouse position
    let size = Math.max(window.innerWidth, window.innerHeight);
    let dpi = window.devicePixelRatio || 1;
    let targetMouseX = (size * dpi) / 2;
    let targetMouseY = (size * dpi) / 2;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;

    // Handle resizing
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      size = Math.max(width, height);
      dpi = window.devicePixelRatio || 1;

      canvas.width = size * dpi;
      canvas.height = size * dpi;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      gl.viewport(0, 0, size * dpi, size * dpi);
      gl.uniform2f(resolutionLoc, size * dpi, size * dpi);
    };

    // Initialize layout dimensions
    handleResize();
    window.addEventListener("resize", handleResize);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate coordinates relative to the centered canvas
      const x = e.clientX - (width - size) / 2;
      const y = ((height + size) / 2) - e.clientY;

      targetMouseX = x * dpi;
      targetMouseY = y * dpi;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Render loop
    const startTime = performance.now();
    let animationFrameId: number;

    const render = () => {
      const elapsedSeconds = (performance.now() - startTime) / 1000;

      // Smooth interpolation for mouse position (momentum follow)
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform2f(mouseLoc, currentMouseX, currentMouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up resources on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
      />
    </div>
  );
}
