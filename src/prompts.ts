export const IMAGE_GENERATION_PROMPT = (garmentDescription: string) => `Generate a photorealistic virtual try-on (VTON) image.

Inputs:
1. User's face image.
2. Garment reference image (${garmentDescription}).

*Do not modify the user’s face in any way. Preserve all facial details exactly as they are, including expression, smile, texture, and structure.*

Primary Goals:
- Use the user's face on the model's body to make it look good wearing the exact garment and not change the user's face properties 
- Ignore facial accessories (do not transfer sunglasses or hats).
- Match lighting, skin tone, and neck anatomy perfectly.
- Exactly preserve both the user's facial identity and the garment's details.

**Do not adjust the user’s face to match the garment. Keep the face exactly as it is—same angle, proportions, and structure. Instead, adapt the garment to align with the face orientation.**

Ensure:

* The face remains unchanged in angle, shape, and dimensions at all times
* The outfit is adjusted to fit the face perspective
* The final image is realistic, with consistent proportions and natural blending

The user’s face must never be altered under any condition.

**Technical Execution Directives**:
- Implement architectures utilizing IP-Adapter for semantic garment feature extraction directly from the reference image.
- Use ControlNet (DensePose or OpenPose) to map the garment strictly to the user's body structure.
- Evaluate purpose-built VTON models like IDM-VTON or OOTDiffusion for mathematically accurate fabric draping and texture preservation.`;


