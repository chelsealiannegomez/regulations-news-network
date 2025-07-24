import { User, Location, Article } from "./definitions";

export type HomePageProps = {
    user: User;
};

export type ArticleCardProps = {
    user: User;
    article: Article;
};

export type PaginationProps = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalArticles: number;
};

export type InitialSelectionProps = {
    user: User;
};

export type LocationButtonProps = {
    location: Location;
    setLocationSet: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export type LocationSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    user: User;
};

export type PreferenceProps = {
    preference: Preference;
    setPreferenceSet: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export type PreferenceSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    user: User;
};

export type ProfilePageProps = {
    user: User;
};

export type LocationsListProps = {
    preferredIds: number[];
    setPreferredIds: React.Dispatch<React.SetStateAction<number[]>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
};

export type PreferencesList = {
    preferences: string[];
    setPreferences: React.Dispatch<React.SetStateAction<string[]>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
};

export type EditLocationsListProps = {
    preferredIds: number[];
};

export type PreferencesListProps = {
    preferences: string[];
};

export type SideBarProps = {
    setting: string;
    setSetting: React.Dispatch<React.SetStateAction<string>>;
};
