// *** Helper function for form manipulations

// get foreign key field label key (as convention for this project => "{name without trailing _id}_label")
// this label key should be passed with each record as a more ui friendly value to display instead of fk number
// ex (organization_id: 1, organization_label: "organization name")
export function formFKLabelKey(name: string): string{
    return `${name.replace("_id", "")}`;
}
