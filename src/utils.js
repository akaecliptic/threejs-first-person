export const forwardVector = ( camera, vector ) => {
    
    camera.getWorldDirection( vector );
    vector.y = 0;
    vector.normalize();

    return vector;
};

export const sideVector = ( camera, vector ) => {

    camera.getWorldDirection( vector );
    vector.y = 0;
    vector.normalize();
    vector.cross( camera.up );

    return vector;
};
