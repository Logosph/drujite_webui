import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import SessionCard from "../components/SessionCard/SessionCard";
import React from "react";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SessionCard">
                <SessionCard id={1} name={"abcdrilla"} description={"asdfghiuytrarx ifgvfdhgg fhgasihydgf iuysgikyasg hgdf jkhgfgosu fsghgfsjkhg ! gkdfgs dkgkghkgkg Dfloskfh sd...."} startDate={"123.123,123,123"} endDate={"42,42.1432.143"} imageUrl={null}/>
            </ComponentPreview>
            <ComponentPreview path="/ComponentPreviews">
                <ComponentPreviews/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;