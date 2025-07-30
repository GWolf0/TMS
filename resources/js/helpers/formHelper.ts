// *** Helper function for form manipulations

// get form item display name
export function h_FormItemDisplayName(name: string, displayName?: string): string{
    // remove trailing _id on fk fields and underscores
    return displayName || name.replace("_id", "").replaceAll("_", " ");
}

// get foreign key field label key (as convention for this project => "{name without trailing _id}_label")
// this label key should be passed with each record as a more ui friendly value to display instead of fk number
// ex (organization_id: 1, organization_label: "organization name")
export function h_FormFKLabelKey(name: string): string{
    return `${name.replace("_id", "")}`;
    // return `${name.replace("_id", "")}_label`;
}
