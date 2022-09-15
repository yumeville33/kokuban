import React from "react";

import Konva from "konva";
import { NodeConfig } from "konva/lib/Node";
import { Image, KonvaNodeEvents } from "react-konva";
import useImage from "use-image";

interface KonvaImageProps {
  src: string;
  imageProps?: NodeConfig | KonvaNodeEvents;
  key?: string | number;
}

const KonvaImage = React.forwardRef(
  (props: KonvaImageProps, ref: React.LegacyRef<Konva.Image> | undefined) => {
    const { src, imageProps, key } = props;

    const [img] = useImage(src, "anonymous");

    return <Image key={key} ref={ref} image={img} {...imageProps} />;
  }
);

export default KonvaImage;
