#ifdef USE_SKINNING
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform mat4 boneMatrices[MAX_BONES];
mat4 getBoneMatrix( const in float i ) {
  mat4 bone = boneMatrices[ int(i) ];
  return bone;
}
#endif
void main() {
  vec3 pos = position + normal * 0.05;
#ifdef USE_SKINNING
  mat4 boneMatX = getBoneMatrix( skinIndex.x );
  mat4 boneMatY = getBoneMatrix( skinIndex.y );
  mat4 boneMatZ = getBoneMatrix( skinIndex.z );
  mat4 boneMatW = getBoneMatrix( skinIndex.w );
  mat4 skinMatrix = mat4( 0.0 );
  skinMatrix += skinWeight.x * boneMatX;
  skinMatrix += skinWeight.y * boneMatY;
  skinMatrix += skinWeight.z * boneMatZ;
  skinMatrix += skinWeight.w * boneMatW;
  skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;
  vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );
  vec3 objectNormal = skinnedNormal.xyz;
  vec3 transformedNormal = normalMatrix * objectNormal;
  vec4 skinVertex = bindMatrix * vec4( pos, 1.0 );
  vec4 skinned = vec4( 0.0 );
  skinned += boneMatX * skinVertex * skinWeight.x;
  skinned += boneMatY * skinVertex * skinWeight.y;
  skinned += boneMatZ * skinVertex * skinWeight.z;
  skinned += boneMatW * skinVertex * skinWeight.w;
  skinned  = bindMatrixInverse * skinned;
  vec4 mvPosition = modelViewMatrix * skinned;
#else
  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
#endif
  gl_Position = projectionMatrix * mvPosition;
}
