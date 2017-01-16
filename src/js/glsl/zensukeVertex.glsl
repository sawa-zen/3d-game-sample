#include <skinning_pars_vertex>

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec3 pos = position;

	#include <skinbase_vertex>
  #include <begin_vertex>
	#include <skinning_vertex>

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  #include <project_vertex>
}
