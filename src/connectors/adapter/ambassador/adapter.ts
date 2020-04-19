import { IAmbassador, IProblemTag, IDepartment } from "../../../types/cms/generated";
import { IPerson, IProfile } from "../../../types/client/client";
import { isAsset, isEntry, ILink, IEntry } from "../../../types/cms";
import { resolveDepartmentType } from "../department/adapter";



export function resolveAmbassadorType(ambassadors: IAmbassador[]): IPerson[] {
    return ambassadors.map((item) => mapAmbassadorToPerson(item));
}

export function mapAmbassadorToPerson(ambassador: IAmbassador): IPerson {
    let data = ambassador.fields;
    let asset = ambassador.fields.profilePicture!!;
    let tags = ambassador.fields.tags;
    // TODO: Better default fields lol
    return {
        id: ambassador.sys.id,
        profileImageUrl: isAsset(asset) && asset.fields.file.url ? asset.fields.file.url : '',
        firstName: data.firstName ? data.firstName : '',
        lastName: data.lastName ? data.lastName : '',
        positionTitle: data.positionTitle? data.positionTitle : '',
        description: data.ambassadorDescription? data.ambassadorDescription : '',
        genderPronouns: data.preferredPronouns ? data.preferredPronouns.join("/") : '',
        tags: tags? resolveTags(tags) : [],
        department: data.department ? resolveDepartmentType(resolveDepartmentLink(data.department)) : null,
        
    }
}

export function mapAmbassadorToProfile(ambassador: IAmbassador): IProfile {
    let data = ambassador.fields;
    let person = mapAmbassadorToPerson(ambassador);

    return {
        ...person,
        relatedPeople: data.relatedAmbassadors ? resolveAmbassadorType(resolveAmbassadorLinks(data.relatedAmbassadors)) : [],
        priorityStatement: data.priorityStatement ? data.priorityStatement : '',
        knowledgeableTopics: data.knowledgeableTopics ? data.knowledgeableTopics : [],
    }
}

function resolveAmbassadorLinks(ambassadors: (ILink<"Entry"> | IAmbassador)[]): IAmbassador[] {
    return resolveEntryLinks<IAmbassador>(ambassadors);
}

function resolveDepartmentLink(department: (ILink<"Entry"> | IDepartment)): IDepartment {
    return resolveEntryLinks<IDepartment>([department])[0];
}

function resolveTags(tags: (ILink<"Entry"> | IProblemTag)[]): string[] {
    let resolvedTags: string[] = [];
    resolveEntryLinks<IProblemTag>(tags).forEach(t => {if (t.fields.tagName) resolvedTags.push(t.fields.tagName)});
    return resolvedTags;
}

function resolveEntryLinks<EntryType extends IEntry<any>>(entries: (ILink<"Entry"> | EntryType)[]): EntryType[] {
    let resolvedEntries: EntryType[] = [];

    entries.forEach((entry) => {
        if (isEntry(entry)) resolvedEntries.push(entry);
    })

    return resolvedEntries;
}
