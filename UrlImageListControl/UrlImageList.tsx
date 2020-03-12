import * as React from 'react';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import { ITheme, getTheme, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {ScrollablePane,ScrollbarVisibility} from "office-ui-fabric-react/lib/ScrollablePane";
import {Pagination} from '@uifabric/experiments/lib/Pagination';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

export interface IUrlImageListProps {
  items: IItem[];
  pageCount: number;
  openRecord: (id:string) => void;
  loadPage: (pageNumber:number) => void;
}

export interface IUrlImageListState {
  selectedPageIndex: number;
}

export interface IItem {
  url: string;
  name: string;
  id: string;
}

interface IUrlImageListClassObject {
  listGridExample: string;
  listGridExampleTile: string;
  listGridExampleSizer: string;
  listGridExamplePadder: string;
  listGridExampleLabel: string;
  listGridExampleImage: string;
  scrollableContainer: string;
}

const theme: ITheme = getTheme();
const { palette, fonts } = theme;

const classNames: IUrlImageListClassObject = mergeStyleSets({
  listGridExample: {
    overflow: 'hidden',
    fontSize: 0,
    position: 'relative'
  },
  listGridExampleTile: {
    textAlign: 'center',
    outline: 'none',
    position: 'relative',
    float: 'left',
    background: palette.neutralLighter,
    selectors: {
      'focus:after': {
        content: '',
        position: 'absolute',
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
        boxSizing: 'border-box',
        border: `1px solid ${palette.white}`
      }
    }
  },
  listGridExampleSizer: {
    paddingBottom: '100%'
  },
  listGridExamplePadder: {
    position: 'absolute',
    left: 2,
    top: 2,
    right: 2,
    bottom: 2,
    selectors: {
      ':hover img': {
        transform: 'scale(0.9)'
      },
      ':hover span': {
        background: 'rgba(0, 0, 0, 0.6)',
      },
      ':hover': {
        cursor: 'pointer'
      }
    }
  },
  listGridExampleLabel: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#FFFFFF',
    position: 'absolute',
    padding: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    fontSize: fonts.small.fontSize,
    boxSizing: 'border-box',
    transition: 'all .2s'
  },
  listGridExampleImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transition: 'all .2s'
  },
  scrollableContainer: {
    height: "100%",
    position: 'relative'
  }
});

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;

export class UrlImageList extends React.Component<IUrlImageListProps,IUrlImageListState,null> {
  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;

  constructor(props: IUrlImageListProps) {
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.state = { 
      selectedPageIndex: 0
    };
  }

  private handleRecordClick(id:string){
    this.props.openRecord(id);
  }

  private loadPage(pageNumber:number){
    this.props.loadPage(pageNumber);
  }

  private onPageChange = (index: number): void => {
    this.loadPage(index+1);

    this.setState({
      selectedPageIndex: index
    });
  }

  public shouldComponentUpdate(nextProps:IUrlImageListProps, nextState:IUrlImageListState) {
    if (this.props.items !== nextProps.items || this.state.selectedPageIndex !== nextState.selectedPageIndex) {
      return true;
    }
    return false;
  }

  public render(): JSX.Element {    
    return (   
      <div className={classNames.scrollableContainer}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
          <Sticky stickyPosition={StickyPositionType.Header}>
            <Pagination
              selectedPageIndex={this.state.selectedPageIndex}
              pageCount={this.props.pageCount}
              onPageChange={this.onPageChange}
              previousPageAriaLabel={'previous page'}
              nextPageAriaLabel={'next page'}
              firstPageAriaLabel={'first page'}
              lastPageAriaLabel={'last page'}
              format={'buttons'}
              pageAriaLabel={'page'}
              firstPageIconProps={{ iconName: 'DoubleChevronLeft' }}
              previousPageIconProps={{ iconName: 'ChevronLeft' }}
              nextPageIconProps={{ iconName: 'ChevronRight' }}
              lastPageIconProps={{ iconName: 'DoubleChevronRight' }}
            />
          </Sticky>  
          <List
            className={classNames.listGridExample}
            items = {this.props.items}
            getItemCountForPage={this._getItemCountForPage}
            getPageHeight={this._getPageHeight}
            renderedWindowsAhead={4}
            onRenderCell={this._onRenderCell}
          />    
        </ScrollablePane>
      </div>
    );
  }

  private _getItemCountForPage = (itemIndex?: number | undefined, surfaceRect?: IRectangle | undefined): number => {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect!.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect!.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  };

  private _getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  };

  private _onRenderCell = (item: IItem | undefined, index: number | undefined): JSX.Element => {
    return (
      <div
        className={classNames.listGridExampleTile}
        data-is-focusable={true}
        style={{
          width: 100 / this._columnCount + '%'
        }}
        onClick={this.handleRecordClick.bind(this, item!.id)}
      >
        <div className={classNames.listGridExampleSizer}>
          <div className={classNames.listGridExamplePadder}>
            <img src={item!.url} className={classNames.listGridExampleImage} />
            <span className={classNames.listGridExampleLabel}>{item!.name}</span>
          </div>
        </div>
      </div>
    );
  };
}
