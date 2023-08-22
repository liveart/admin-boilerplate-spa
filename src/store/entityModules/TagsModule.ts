import { TagDTO } from '../../api/dto/TagDTO';
import { ITableHeader } from '../../models/filters/Filters';
import { SearchQueryFilters } from '../../models/filters/SearchQueryFilters';
import { CrudModule } from '../entityModules/CrudModule';
import { Tag} from '../../models/entities/Tag';
import { EntityType } from '../entityModules/types';
class TagModule extends CrudModule<Tag, TagDTO> {
  constructor() {
    super();
    this.state = {
      ...this.state,

      entityType: EntityType.TAG,
      queryFilters: new SearchQueryFilters({}),
    };

    this.getters = {
      ...this.getters,

      getItem: state => (id: string) => {
        const item = state.items.find((i: Tag) => i.id === id);
        return item || null;
      },

      getSearchValue(state): string | null {
        const filter = state.queryFilters as SearchQueryFilters;
        if (!filter.searchFilter) return null;
        return filter.searchFilter.value || null;
      },

      getSearchHeaders(state): ITableHeader[] {
        const filter = state.queryFilters as SearchQueryFilters;
        if (!filter.searchFilter) return [];
        return filter.searchFilter.headers;
      },
    };

    this.actions = {
      ...this.actions,

      setSearchValue({ getters, commit }, value: string | null) {
        commit('setQueryFilters', {
          searchFilter: {
            value,
            headers: getters.getSearchHeaders,
          },
          page: 1,
        });
      },

      setSearchHeaders({ commit }, value: ITableHeader[]) {
        commit('setQueryFilters', {
          searchFilter: {
            headers: value,
          },
        });
      },
    };
  }
}

const tagsModule = new TagModule();
export default tagsModule;
