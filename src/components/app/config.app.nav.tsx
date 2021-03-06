const configAppNav = {
    "items": [
      {
        "label": "Home",
        "uri": "/",
        "componentFilePath": "./components/home/Home",
        "reactRouterRouteParams": {
          "exact": true
        }
      },
      {
        "label": "Chapter 2",
        "uri": "/chp2/index",
        "componentFilePath": "./components/chp2/Chapter2",
        "items": [
          {
            "label": "Draw a Rectangle",
            "uri": "/chp2/draw-rectangle",
            "componentFilePath": "./components/chp2/DrawRectangle"
          },
          {
            "label": "Draw a Point",
            "uri": "/chp2/draw-a-point",
            "componentFilePath": "./components/chp2/DrawAPoint"
          },
          {
            "label": "Draw a Point 2",
            "uri": "/chp2/draw-a-point-2",
            "componentFilePath": "./components/chp2/DrawAPoint2"
          },
          {
            "label": "Draw a Point 3",
            "uri": "/chp2/draw-a-point-3",
            "componentFilePath": "./components/chp2/DrawAPoint3"
          }
        ]
      },
      {
        "label": "Chapter 3",
        "uri": "/chp3/index",
        "componentFilePath": "./components/chp3/Chapter3",
        "items": [
          {
            "label": "Multi Point",
            "uri": "/chp3/multi-point",
            "componentFilePath": "./components/chp3/MultiPoint"
          },
          {
            "label": "Hello Triangle",
            "uri": "/chp3/hello-triangle",
            "componentFilePath": "./components/chp3/HelloTriangle"
          },
          {
            "label": "Hello Quad",
            "uri": "/chp3/hello-quad",
            "componentFilePath": "./components/chp3/HelloQuad"
          },
          {
            "label": "Translated Triangle",
            "uri": "/chp3/translated-triangle",
            "componentFilePath": "./components/chp3/TranslatedTriangle"
          },
          {
            "label": "Rotated Triangle",
            "uri": "/chp3/rotated-triangle",
            "componentFilePath": "./components/chp3/RotatedTriangle"
          },
          {
            "label": "Rotated Triangle by Matrix",
            "uri": "/chp3/rotated-triangle-matrix",
            "componentFilePath": "./components/chp3/RotatedTriangle_Matrix"
          },
          {
            "label": "Translate Triangle by Matrix",
            "uri": "/chp3/translated-triangle-matrix",
            "componentFilePath": "./components/chp3/TranslatedTriangle_Matrix"
          },
          {
            "label": "Scaled Triangle by Matrix",
            "uri": "/chp3/scaled-triangle-matrix",
            "componentFilePath": "./components/chp3/ScaledTriangle_Matrix"
          }
        ]
      },
      {
        "label": "Chapter 4",
        "uri": "/chp4/index",
        "componentFilePath": "./components/chp4/Chapter4",
        "items": [
          {
            "label": "Rotated and Translated Triangle",
            "uri": "/chp4/rotated-translated-triangle",
            "componentFilePath": "./components/chp4/RotatedTranslatedTriangle"
          },
          {
            "label": "Rotating Triangle",
            "uri": "/chp4/rotating-triangle",
            "componentFilePath": "./components/chp4/RotatingTriangle"
          },
          {
            "label": "Orbiting Triangle",
            "uri": "/chp4/orbiting-triangle",
            "componentFilePath": "./components/chp4/OrbitingTriangle"
          },
          {
            "label": "Rotating Triangle with Buttons",
            "uri": "/chp4/rotating-triangle-with-buttons",
            "componentFilePath": "./components/chp4/RotatingTriangleWithButtons"
          }
        ]
      },
      {
        "label": "Chapter 5",
        "uri": "/chp5/index",
        "componentFilePath": "./components/chp5/Chapter5",
        "items": [
          {
            "label": "Multi Attribute Size",
            "uri": "/chp5/multi-attribute-size",
            "componentFilePath": "./components/chp5/MultiAttributeSize"
          },
          {
            "label": "Multi Attribute Size Interleaved",
            "uri": "/chp5/multi-attribute-size-interleaved",
            "componentFilePath": "./components/chp5/MultiAttributeSize_Interleaved"
          },
          {
            "label": "Multi Attribute Color",
            "uri": "/chp5/multi-attribute-color",
            "componentFilePath": "./components/chp5/MultiAttributeColor"
          },
          {
            "label": "Colored Triangle",
            "uri": "/chp5/colored-triangle",
            "componentFilePath": "./components/chp5/ColoredTriangle"
          },
          {
            "label": "Hello Triangle Frag Coord",
            "uri": "/chp5/hello-triangle-frag-coord",
            "componentFilePath": "./components/chp5/HelloTriangle_FragCoord"
          },
          {
            "label": "Texture Quad",
            "uri": "/chp5/texture-quad",
            "componentFilePath": "./components/chp5/TextureQuad"
          },
          {
            "label": "Texture Quad Repeat",
            "uri": "/chp5/texture-quad-repeat",
            "componentFilePath": "./components/chp5/TextureQuad_Repeat"
          },
          {
            "label": "Texture Quad Clamp Mirrored",
            "uri": "/chp5/texture-quad-clamp-mirror",
            "componentFilePath": "./components/chp5/TextureQuad_Clamp_Mirror"
          },
          {
            "label": "Multi Texture",
            "uri": "/chp5/multi-texture",
            "componentFilePath": "./components/chp5/MultiTexture"
          }
        ]
      },
      {
        "label": "Chapter 7",
        "uri": "/chp7/index",
        "componentFilePath": "./components/chp7/Chapter7",
        "items": [
          {
            "label": "Look at Triangles",
            "uri": "/chp7/look-at-triangles",
            "componentFilePath": "./components/chp7/LookAtTriangles"
          },
          {
            "label": "Look at Rotated Triangles",
            "uri": "/chp7/look-at-rotated-triangles",
            "componentFilePath": "./components/chp7/LookAtRotatedTriangles"
          },
          {
            "label": "Look at Rotated Triangles (Model View Matrix)",
            "uri": "/chp7/look-at-rotated-triangles_mvMatrix",
            "componentFilePath": "./components/chp7/LookAtRotatedTriangles_mvMatrix"
          },
          {
            "label": "Look at Rotated Triangles With Keys",
            "uri": "/chp7/look-at-rotated-triangles-with-keys",
            "componentFilePath": "./components/chp7/LookAtRotatedTrianglesWithKeys"
          },
          {
            "label": "Orthographic View",
            "uri": "/chp7/ortho-view",
            "componentFilePath": "./components/chp7/OrthoView"
          },
          {
            "label": "Look at Rotated Triangles With Keys (View Volume)",
            "uri": "/chp7/look-at-rotated-triangles-with-keys-view-volume",
            "componentFilePath": "./components/chp7/LookAtRotatedTrianglesWithKeys_ViewVolume"
          },
          {
            "label": "Perspective View",
            "uri": "/chp7/perspective-view",
            "componentFilePath": "./components/chp7/PerspectiveView"
          },
          {
            "label": "Perspective View (mvp)",
            "uri": "/chp7/perspective-view-mvp",
            "componentFilePath": "./components/chp7/PerspectiveView_mvp"
          },
          {
            "label": "Perspective View (Mvp Matrix)",
            "uri": "/chp7/perspective-view-mvp-matrix",
            "componentFilePath": "./components/chp7/PerspectiveView_mvpMatrix"
          },
          {
            "label": "Depth Buffer",
            "uri": "/chp7/depth-buffer",
            "componentFilePath": "./components/chp7/DepthBuffer"
          },
          {
            "label": "Z-Fighting",
            "uri": "/chp7/z-fighting",
            "componentFilePath": "./components/chp7/ZFighting"
          },
          {
            "label": "Hello Cube",
            "uri": "/chp7/hello-cube",
            "componentFilePath": "./components/chp7/HelloCube"
          },
          {
            "label": "Colored Cube",
            "uri": "/chp7/colored-cube",
            "componentFilePath": "./components/chp7/ColoredCube"
          },
          {
            "label": "Colored Cube (single color)",
            "uri": "/chp7/colored-cube-single-color",
            "componentFilePath": "./components/chp7/ColoredCube_singleColor"
          }
        ]
      },
      {
        "label": "Chapter 8",
        "uri": "/chp8/index",
        "componentFilePath": "./components/chp8/Chapter8",
        "items": [
          {
            "label": "Lighted Cube",
            "uri": "/chp8/lighted-cube",
            "componentFilePath": "./components/chp8/LightedCube"
          },
          {
            "label": "Lighted Cube (ambient)",
            "uri": "/chp8/lighted-cube-ambient",
            "componentFilePath": "./components/chp8/LightedCube_ambient"
          },
          {
            "label": "Lighted, Translated, and Rotated Cube",
            "uri": "/chp8/lighted-cube-translated-rotated-cube",
            "componentFilePath": "./components/chp8/LightedTranslatedRotatedCube"
          },
          {
            "label": "Point Lighted Cube",
            "uri": "/chp8/point-lighted-cube",
            "componentFilePath": "./components/chp8/PointLightedCube"
          },
          {
            "label": "Point Lighted Cube Animated",
            "uri": "/chp8/point-lighted-cube-animated",
            "componentFilePath": "./components/chp8/PointLightedCubeAnimated"
          },
          {
            "label": "Point Lighted Cube (per fragment)",
            "uri": "/chp8/point-lighted-cube-per-fragment",
            "componentFilePath": "./components/chp8/PointLightedCube_perFragment"
          }
        ]
      },
      {
        "label": "Chapter 9",
        "uri": "/chp9/index",
        "componentFilePath": "./components/chp9/Chapter9",
        "items": [
          {
            "label": "Joint Model",
            "uri": "/chp9/joint-model",
            "componentFilePath": "./components/chp9/JointModel"
          },
          {
            "label": "Multi Joint Model",
            "uri": "/chp9/multi-joint-model",
            "componentFilePath": "./components/chp9/MultiJointModel"
          },
          {
            "label": "Multi Joint Model (segment)",
            "uri": "/chp9/multi-joint-model-segment",
            "componentFilePath": "./components/chp9/MultiJointModel_segment"
          }
        ]
      },
      {
        "label": "Chapter 10",
        "uri": "/chp10/index",
        "componentFilePath": "./components/chp10/Chapter10",
        "items": [
          {
            "label": "Rotate Object",
            "uri": "/chp10/rotate-object",
            "componentFilePath": "./components/chp10/RotateObject"
          },
          {
            "label": "Pick Object",
            "uri": "/chp10/pick-object",
            "componentFilePath": "./components/chp10/PickObject"
          },
          {
            "label": "Pick Face",
            "uri": "/chp10/pick-face",
            "componentFilePath": "./components/chp10/PickFace"
          },
          {
            "label": "Hud (heads up display)",
            "uri": "/chp10/hud",
            "componentFilePath": "./components/chp10/HUD"
          },
          {
            "label": "3D Over",
            "uri": "/chp10/3d-over",
            "componentFilePath": "./components/chp10/ThreeDOver"
          },
          {
            "label": "Fog",
            "uri": "/chp10/fog",
            "componentFilePath": "./components/chp10/Fog"
          },
          {
            "label": "FogW",
            "uri": "/chp10/fogw",
            "componentFilePath": "./components/chp10/FogW"
          },
          {
            "label": "Rounded Points",
            "uri": "/chp10/rounded-points",
            "componentFilePath": "./components/chp10/RoundedPoints"
          },
          {
            "label": "Look at Blended Triangles",
            "uri": "/chp10/look-at-blended-triangles",
            "componentFilePath": "./components/chp10/LookAtBlendedTriangles"
          },
          {
            "label": "Blended Cube",
            "uri": "/chp10/blended-cube",
            "componentFilePath": "./components/chp10/BlendedCube"
          },
          {
            "label": "Program Object",
            "uri": "/chp10/program-object",
            "componentFilePath": "./components/chp10/ProgramObject"
          },
          {
            "label": "Frame Buffer Object",
            "uri": "/chp10/frame-buffer-object",
            "componentFilePath": "./components/chp10/FramebufferObject"
          },
          {
            "label": "Shadow",
            "uri": "/chp10/shadow",
            "componentFilePath": "./components/chp10/Shadow2"
          }
        ]
      }
    ]
  };

export default configAppNav;
