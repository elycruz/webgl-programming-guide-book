import React, {ComponentClass, ComponentType} from 'react';
import {error} from '../../utils/console';

const returnErrorView = err => {
    error(err);
    return {
      default: function PageNotFound() {
        return <h2>Page not found</h2>;
      }
    };
  },

  Home = React.lazy(() => import('../home/Home').catch(returnErrorView)),

  Chapter2 = React.lazy(() => import('../chp2/Chapter2').catch(returnErrorView)),

  DrawRectangle = React.lazy(() => import('../chp2/DrawRectangle').catch(returnErrorView)),

  viewsMap = {
    './components/home/Home': Home,
    './components/chp2/Chapter2': Chapter2,
    './components/chp2/DrawRectangle': DrawRectangle,
    './components/chp2/DrawAPoint': React.lazy(() => import('../chp2/DrawAPoint').catch(returnErrorView)),
    './components/chp2/DrawAPoint2': React.lazy(() => import('../chp2/DrawAPoint2').catch(returnErrorView)),
    './components/chp2/DrawAPoint3': React.lazy(() => import('../chp2/DrawAPoint3').catch(returnErrorView)),
    './components/chp3/Chapter3': React.lazy(() => import('../chp3/Chapter3').catch(returnErrorView)),
    './components/chp3/MultiPoint': React.lazy(() => import('../chp3/MultiPoint').catch(returnErrorView)),
    './components/chp3/HelloTriangle': React.lazy(() => import('../chp3/HelloTriangle').catch(returnErrorView)),
    './components/chp3/HelloQuad': React.lazy(() => import('../chp3/HelloQuad').catch(returnErrorView)),
    './components/chp3/TranslatedTriangle': React.lazy(() => import('../chp3/TranslatedTriangle').catch(returnErrorView)),
    './components/chp3/RotatedTriangle': React.lazy(() => import('../chp3/RotatedTriangle').catch(returnErrorView)),
    './components/chp3/RotatedTriangle_Matrix': React.lazy(() => import('../chp3/RotatedTriangle_Matrix').catch(returnErrorView)),
    './components/chp3/TranslatedTriangle_Matrix': React.lazy(() => import('../chp3/TranslatedTriangle_Matrix').catch(returnErrorView)),
    './components/chp3/ScaledTriangle_Matrix': React.lazy(() => import('../chp3/ScaledTriangle_Matrix').catch(returnErrorView)),
    './components/chp4/Chapter4': React.lazy(() => import('../chp4/Chapter4').catch(returnErrorView)),
    './components/chp4/RotatedTranslatedTriangle': React.lazy(() => import('../chp4/RotatedTranslatedTriangle').catch(returnErrorView)),
    './components/chp4/RotatingTriangle': React.lazy(() => import('../chp4/RotatingTriangle').catch(returnErrorView)),
    './components/chp4/OrbitingTriangle': React.lazy(() => import('../chp4/OrbitingTriangle').catch(returnErrorView)),
    './components/chp4/RotatingTriangleWithButtons': React.lazy(() => import('../chp4/RotatingTriangleWithButtons').catch(returnErrorView)),
    './components/chp5/Chapter5': React.lazy(() => import('../chp5/Chapter5').catch(returnErrorView)),
    './components/chp5/MultiAttributeSize': React.lazy(() => import('../chp5/MultiAttributeSize').catch(returnErrorView)),
    './components/chp5/MultiAttributeSize_Interleaved': React.lazy(() => import('../chp5/MultiAttributeSize_Interleaved').catch(returnErrorView)),
    './components/chp5/MultiAttributeColor': React.lazy(() => import('../chp5/MultiAttributeColor').catch(returnErrorView)),
    './components/chp5/ColoredTriangle': React.lazy(() => import('../chp5/ColoredTriangle').catch(returnErrorView)),
    './components/chp5/HelloTriangle_FragCoord': React.lazy(() => import('../chp5/HelloTriangle_FragCoord').catch(returnErrorView)),
    './components/chp5/TextureQuad': React.lazy(() => import('../chp5/TextureQuad').catch(returnErrorView)),
    './components/chp5/TextureQuad_Repeat': React.lazy(() => import('../chp5/TextureQuad_Repeat').catch(returnErrorView)),
    './components/chp5/TextureQuad_Clamp_Mirror': React.lazy(() => import('../chp5/TextureQuad_Clamp_Mirror').catch(returnErrorView)),
    './components/chp5/MultiTexture': React.lazy(() => import('../chp5/MultiTexture').catch(returnErrorView)),
    './components/chp7/Chapter7': React.lazy(() => import('../chp7/Chapter7').catch(returnErrorView)),
    './components/chp7/LookAtTriangles': React.lazy(() => import('../chp7/LookAtTriangles').catch(returnErrorView)),
    './components/chp7/LookAtRotatedTriangles': React.lazy(() => import('../chp7/LookAtRotatedTriangles').catch(returnErrorView)),
    './components/chp7/LookAtRotatedTriangles_mvMatrix': React.lazy(() => import('../chp7/LookAtRotatedTriangles_mvMatrix').catch(returnErrorView)),
    './components/chp7/LookAtRotatedTrianglesWithKeys': React.lazy(() => import('../chp7/LookAtRotatedTrianglesWithKeys').catch(returnErrorView)),
    './components/chp7/OrthoView': React.lazy(() => import('../chp7/OrthoView').catch(returnErrorView)),
    './components/chp7/LookAtRotatedTrianglesWithKeys_ViewVolume': React.lazy(() => import('../chp7/LookAtRotatedTrianglesWithKeys_ViewVolume').catch(returnErrorView)),
    './components/chp7/PerspectiveView': React.lazy(() => import('../chp7/PerspectiveView').catch(returnErrorView)),
    './components/chp7/PerspectiveView_mvp': React.lazy(() => import('../chp7/PerspectiveView_mvp').catch(returnErrorView)),
    './components/chp7/PerspectiveView_mvpMatrix': React.lazy(() => import('../chp7/PerspectiveView_mvpMatrix').catch(returnErrorView)),
    './components/chp7/DepthBuffer': React.lazy(() => import('../chp7/DepthBuffer').catch(returnErrorView)),
    './components/chp7/ZFighting': React.lazy(() => import('../chp7/ZFighting').catch(returnErrorView)),
    './components/chp7/HelloCube': React.lazy(() => import('../chp7/HelloCube').catch(returnErrorView)),
    './components/chp7/ColoredCube': React.lazy(() => import('../chp7/ColoredCube').catch(returnErrorView)),
    './components/chp7/ColoredCube_singleColor': React.lazy(() => import('../chp7/ColoredCube_singleColor').catch(returnErrorView)),
    './components/chp8/Chapter8': React.lazy(() => import('../chp8/Chapter8').catch(returnErrorView)),
    './components/chp8/LightedCube': React.lazy(() => import('../chp8/LightedCube').catch(returnErrorView)),
    './components/chp8/LightedCube_ambient': React.lazy(() => import('../chp8/LightedCube_ambient').catch(returnErrorView)),
    './components/chp8/LightedTranslatedRotatedCube': React.lazy(() => import('../chp8/LightedTranslatedRotatedCube').catch(returnErrorView)),
    './components/chp8/PointLightedCube': React.lazy(() => import('../chp8/PointLightedCube').catch(returnErrorView)),
    './components/chp8/PointLightedCubeAnimated': React.lazy(() => import('../chp8/PointLightedCubeAnimated').catch(returnErrorView)),
    './components/chp8/PointLightedCube_perFragment': React.lazy(() => import('../chp8/PointLightedCube_perFragment').catch(returnErrorView)),
    './components/chp9/Chapter9': React.lazy(() => import('../chp9/Chapter9').catch(returnErrorView)),
    './components/chp9/JointModel': React.lazy(() => import('../chp9/JointModel').catch(returnErrorView)),
    './components/chp9/MultiJointModel': React.lazy(() => import('../chp9/MultiJointModel').catch(returnErrorView)),
    './components/chp9/MultiJointModel_segment': React.lazy(() => import('../chp9/MultiJointModel_segment').catch(returnErrorView)),
    './components/chp10/Chapter10': React.lazy(() => import('../chp10/Chapter10').catch(returnErrorView)),
    './components/chp10/RotateObject': React.lazy(() => import('../chp10/RotateObject').catch(returnErrorView)),
    './components/chp10/PickObject': React.lazy(() => import('../chp10/PickObject').catch(returnErrorView)),
    './components/chp10/PickFace': React.lazy(() => import('../chp10/PickFace').catch(returnErrorView)),
    './components/chp10/HUD': React.lazy(() => import('../chp10/HUD').catch(returnErrorView)),
    './components/chp10/ThreeDOver': React.lazy(() => import('../chp10/ThreeDOver').catch(returnErrorView)),
    './components/chp10/Fog': React.lazy(() => import('../chp10/Fog').catch(returnErrorView)),
    './components/chp10/FogW': React.lazy(() => import('../chp10/FogW').catch(returnErrorView)),
    './components/chp10/RoundedPoints': React.lazy(() => import('../chp10/RoundedPoints').catch(returnErrorView)),
    './components/chp10/LookAtBlendedTriangles': React.lazy(() => import('../chp10/LookAtBlendedTriangles').catch(returnErrorView)),
    './components/chp10/BlendedCube': React.lazy(() => import('../chp10/BlendedCube').catch(returnErrorView)),
    './components/chp10/ProgramObject': React.lazy(() => import('../chp10/ProgramObject').catch(returnErrorView)),
    './components/chp10/FramebufferObject': React.lazy(() => import('../chp10/FramebufferObject').catch(returnErrorView)),
    './components/chp10/Shadow2': React.lazy(() => import('../chp10/Shadow2').catch(returnErrorView))
  };

export default viewsMap;
