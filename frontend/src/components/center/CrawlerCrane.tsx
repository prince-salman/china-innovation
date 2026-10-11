// @ts-nocheck
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes } = useGLTF('/scene.gltf')

  return (
    <group {...props} dispose={null}>
      <group position={[-0.213, 8.068, 4.094]} rotation={[2.499, 0, Math.PI / 2]}>
        {/* Rangka / Arm Crane (Kuning XCMG) */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['Object015_04_-_Default_0'].geometry}
        >
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.4} />
        </mesh>
        
        {/* Kabel / Katrol (Hitam Metalik) */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['Object015_01_-_Default_0'].geometry}
        >
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      <group position={[-0.913, 1.789, -1.505]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        {/* Body Utama Crane (Kuning XCMG) */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['Object018_01_-_Default_0'].geometry}
        >
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* Kabin / Komponen Gelap */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['Object018_03_-_Default_0'].geometry}
        >
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Roda Rantai / Crawler Base */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object018_Default_0.geometry}
        >
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.7} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes['Object018_02_-_Default_0'].geometry}
        >
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Object021_03_-_Default_0'].geometry}
        position={[-0.913, 1.789, -1.505]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Plane006_05_-_Default_0'].geometry}
        position={[0, 1.526, 0.731]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.4} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Cylinder003_02_-_Default_0'].geometry}
        position={[0, 1.798, -2.197]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/scene.gltf')