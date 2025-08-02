import slugify from 'slugify';

const normalizeText = (text: string): string => text.replace(/[_\.]+/g, ' ').trim();

const generateSlug = (text: string): string => slugify(normalizeText(text), { lower: true, strict: true });

export const generateUniqueSlug = async (
    baseText: string,
    checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
    let slug = generateSlug(baseText);
    let suffix = 1;

    while (await checkExists(slug)) {
        slug = `${generateSlug(baseText)}-${suffix++}`;
    }

    return slug;
};

/**
 * 
* Documentación técnica: Generación automática y única de slugs
* Objetivo
* Evitar colisiones de slug en productos al generar automáticamente un identificador único basado en el title o en un slug definido manualmente por el admin.

* ¿Dónde se genera el slug?
* Toda la lógica de generación de slug se encuentra en el servicio de productos, tanto en el método create como en update. *  * Esto mantiene los controladores limpios y centraliza la lógica de negocio.

* ¿Cómo funciona?
- Si el admin define un slug manualmente, se normaliza (slugify) y se verifica que no exista.
- Si no lo define, se genera automáticamente a partir del title.
- Si el slug ya existe, se le agrega un sufijo incremental (-1, -2, etc.) hasta encontrar uno único.

* Helper utilizado
* generateUniqueSlug(baseText: string, checkExists: (slug: string) => Promise<boolean>): Promise<string>

* Este helper se encuentra en helpers/slug.helper.ts y se usa así:
const finalSlug = await generateUniqueSlug(
    slug ?? title,
    async (slugCandidate) => {
        const existing = await this.productRepository.findOneBy({ slug: slugCandidate });
        return !!existing;
    }
);

* Beneficios
- Evita duplicidad de slugs que romperían el frontend.
- No depende del nivel de detalle del admin.
- Mantiene consistencia entre creación y actualización.
- Fácil de extender para otros módulos (categorías, posts, etc.).

* Recomendación
* Agregar tests unitarios para el helper generateUniqueSlug, simulando colisiones y verificando que se generen sufijos *correctamente.
*/