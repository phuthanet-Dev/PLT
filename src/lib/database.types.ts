export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type PetGender = 'male' | 'female' | 'unknown';
export type PetStatus = 'available' | 'adopted' | 'closed';

export interface Profile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    line_id: string | null;
    created_at: string;
}

export interface Pet {
    id: string;
    owner_id: string;
    name: string;
    species: PetSpecies;
    breed: string | null;
    age_text: string | null;
    gender: PetGender;
    description: string | null;
    image_urls: string[];
    province: string | null;
    status: PetStatus;
    created_at: string;
    updated_at: string;
    // Joined data
    profiles?: Profile;
}

export interface PetInsert {
    name: string;
    species: PetSpecies;
    breed?: string;
    age_text?: string;
    gender: PetGender;
    description?: string;
    image_urls?: string[];
    province?: string;
}

export interface PetUpdate extends Partial<PetInsert> {
    status?: PetStatus;
}
