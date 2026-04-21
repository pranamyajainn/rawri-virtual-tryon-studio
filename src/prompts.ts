export const IMAGE_GENERATION_PROMPT = (garmentDescription: string) => `CRITICAL TASK: REDRESS THE USER.
You are performing a Virtual Try-On (VTON) by keeping Image 1 as the BASE and only changing their clothes.

Inputs:
1. User's image (Base).
2. Garment image (${garmentDescription}) (Style Reference).

*Do not modify the user’s face in any way. Preserve all facial details exactly as they are, including expression, smile, texture, and structure.*

Primary Goals:
- REDRESS the user in Image 1. DO NOT try to put the user's face onto the catalog model's body. 
- Generate the garment from Image 2 onto the user's existing body and pose in Image 1.
- MATCH SKIN TONE ABSOLUTELY: The skin tone of the chest, neck, and arms must 100% match the user's original face in Image 1. Do not use the catalog model's skin color.
- Ignore facial accessories (do not transfer sunglasses or hats).
- Exactly preserve both the user's facial identity and the garment's details.

**Do not adjust the user’s face to match the garment. Keep the face exactly as it is—same angle, proportions, and structure. Instead, adapt the garment to align with the face orientation.**

Ensure:
* The face remains unchanged in angle, shape, and dimensions at all times
* The user's original skin tone is applied universally to any exposed body parts
* The outfit is warped and adjusted to fit the face perspective and existing posture
* The final image is realistic, with consistent proportions and natural blending

The user’s face must never be altered under any condition.

**Technical Execution Directives**:
- Execute an INPAINTING/REDRESSING workflow on Image 1, not a face-swap.
- Implement architectures utilizing IP-Adapter for semantic garment feature extraction directly from the reference image.
- Use ControlNet (DensePose or OpenPose) to map the garment strictly to the user's existing body structure.
- Evaluate purpose-built VTON models like IDM-VTON or OOTDiffusion for mathematically accurate fabric draping and texture preservation.`;


