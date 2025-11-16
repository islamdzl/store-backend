declare global {
    interface Category {
        _id: ID;
        name: string;
        icon: string;
        branchs: Category.Branch[];
        __v: number;
    }
    namespace Category {
        interface Branch {
            _id: ID;
            name: string;
            icon: string;
            posts: number;
            __v: number;
        }
        interface CreateCategory extends Omit<Category, '_id' | '__v'> {
        }
        interface CreateBranch extends Omit<Category.Branch, '_id' | '__v'> {
        }
        interface UpdateCategory extends Omit<CreateCategory, 'branchs'> {
        }
        interface UpdateBranch extends Omit<CreateBranch, 'posts'> {
        }
    }
}
export {};
//# sourceMappingURL=category.interface.d.ts.map