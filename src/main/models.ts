/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */

export declare type PageSize = 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';

export declare type PaperSize = '80mm' | '78mm' | '76mm' | '57mm' | '58mm' | '44mm';

export interface SizeOptions {
    height: number;
    width: number;
}

export interface PosPrintOptions {
    /**
     * @description Print options
     * {@link https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback}
     * @field copies: number of copies to print
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     * @field silent: To print silently
     * @field pathTemplate: Path to HTML file for custom print options
     */
    header?: string;
    width?: string | number; // width of page and body
    footer?: string;
    copies?: number;
    preview?: boolean;
    printerName?: string;
    margin?: string;
    timeOutPerLine?: number;
    // width?: string;
    silent?: boolean;
    color?: boolean;
    printBackground?; boolean;
    margins?: {
        marginType?: 'default' | 'none'| 'printableArea'| 'custom',
        top?: number;
        bottom?: number;
        right?: number;
        left?: number;
    }
    landscape?: boolean;
    scaleFactor?: number;
    pagesPerSheet?: number;
    collate?: boolean;
    pageRanges?: { from: number, to: number}[],
    duplexMode?: 'simplex' | 'shortEdge' | 'longEdge',
    pageSize?: PaperSize | SizeOptions,
    dpi?: { horizontal: number, vertical: number },
    pathTemplate?: string;
}


export interface SizeOptions {
    height: number;
    width: number;
}
/**
 * @type PosPrintPosition
 * @description Alignment for type barCode and qrCode
 *
 */
export declare type PosPrintPosition = 'left' | 'center' | 'right';
/**
 * @interface
 * @name PosPrintTableField
 * */
export interface PosPrintTableField {
    type: 'text' | 'image';
    value?: string;
    path?: string;
    // css?: any;
    style?: PrintDataStyle;
    width?: string;  // for type image
    height?: string; // for type image
}

/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    /**
     * @property type
     * @description type data to print: 'text' | 'barCode' | 'qrcode' | 'image' | 'table'
    */
    type: PosPrintType;
    value?: string;
    // css?: any;
    style?: PrintDataStyle;
    width?: string;
    height?: string;
    fontsize?: number;       // for barcodes
    displayValue?: boolean;  // for barcodes
    position?: PosPrintPosition;        // for type image, barcode and qrCode; values: 'left'| 'center' | 'right'
    path?: string;                      // image path
    url?: string;                       // image url or base64 object url
    tableHeader?: PosPrintTableField[] | string[],        // specify the columns in table header, to be used with type table
    tableBody?: PosPrintTableField[][] | string[][],         //  specify the columns in table body, to be used with type table
    tableFooter?: PosPrintTableField[] | string[],      //  specify the columns in table footer, to be used with type table
    tableHeaderStyle?: PrintDataStyle;                // (type table), set custom style for table header
    tableBodyStyle?: PrintDataStyle;                // (type table), set custom style for table body
    tableFooterStyle?: PrintDataStyle;             // (type table), set custom style for table footer
}
/**
 * @type PosPrintType
 * @name PosPrintType
 * **/
export declare type PosPrintType = 'text' | 'barCode' | 'qrCode' | 'image' | 'table';

/**
 *
 * CSS Style interface
 */
export interface PrintDataStyle {
    accentColor?: string;
    alignContent?: string;
    alignItems?: string;
    alignSelf?: string;
    alignmentBaseline?: string;
    all?: string;
    appearance?: string;
    aspectRatio?: string;
    backfaceVisibility?: string;
    background?: string;
    backgroundAttachment?: string;
    backgroundBlendMode?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    baselineShift?: string;
    blockSize?: string;
    border?: string;
    borderBlock?: string;
    borderBlockColor?: string;
    borderBlockEnd?: string;
    borderBlockEndColor?: string;
    borderBlockEndStyle?: string;
    borderBlockEndWidth?: string;
    borderBlockStart?: string;
    borderBlockStartColor?: string;
    borderBlockStartStyle?: string;
    borderBlockStartWidth?: string;
    borderBlockStyle?: string;
    borderBlockWidth?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderCollapse?: string;
    borderColor?: string;
    borderEndEndRadius?: string;
    borderEndStartRadius?: string;
    borderImage?: string;
    borderImageOutset?: string;
    borderImageRepeat?: string;
    borderImageSlice?: string;
    borderImageSource?: string;
    borderImageWidth?: string;
    borderInline?: string;
    borderInlineColor?: string;
    borderInlineEnd?: string;
    borderInlineEndColor?: string;
    borderInlineEndStyle?: string;
    borderInlineEndWidth?: string;
    borderInlineStart?: string;
    borderInlineStartColor?: string;
    borderInlineStartStyle?: string;
    borderInlineStartWidth?: string;
    borderInlineStyle?: string;
    borderInlineWidth?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRadius?: string;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderSpacing?: string;
    borderStartEndRadius?: string;
    borderStartStartRadius?: string;
    borderStyle?: string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderTopStyle?: string;
    borderTopWidth?: string;
    borderWidth?: string;
    bottom?: string;
    boxShadow?: string;
    boxSizing?: string;
    breakAfter?: string;
    breakBefore?: string;
    breakInside?: string;
    captionSide?: string;
    caretColor?: string;
    clear?: string;
    /** @deprecated */
    clip?: string;
    clipPath?: string;
    clipRule?: string;
    color?: string;
    colorInterpolation?: string;
    colorInterpolationFilters?: string;
    colorScheme?: string;
    columnCount?: string;
    columnFill?: string;
    columnGap?: string;
    columnRule?: string;
    columnRuleColor?: string;
    columnRuleStyle?: string;
    columnRuleWidth?: string;
    columnSpan?: string;
    columnWidth?: string;
    columns?: string;
    contain?: string;
    content?: string;
    counterIncrement?: string;
    counterReset?: string;
    counterSet?: string;
    cssFloat?: string;
    cssText?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    dominantBaseline?: string;
    emptyCells?: string;
    fill?: string;
    fillOpacity?: string;
    fillRule?: string;
    filter?: string;
    flex?: string;
    flexBasis?: string;
    flexDirection?: string;
    flexFlow?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexWrap?: string;
    float?: string;
    floodColor?: string;
    floodOpacity?: string;
    font?: string;
    fontFamily?: string;
    fontFeatureSettings?: string;
    fontKerning?: string;
    fontOpticalSizing?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontSynthesis?: string;
    fontVariant?: string;
    fontVariantAlternates?: string;
    fontVariantCaps?: string;
    fontVariantEastAsian?: string;
    fontVariantLigatures?: string;
    fontVariantNumeric?: string;
    fontVariantPosition?: string;
    fontVariationSettings?: string;
    fontWeight?: string;
    gap?: string;
    grid?: string;
    gridArea?: string;
    gridAutoColumns?: string;
    gridAutoFlow?: string;
    gridAutoRows?: string;
    gridColumn?: string;
    gridColumnEnd?: string;
    /** @deprecated This is a legacy alias of `columnGap`. */
    gridColumnGap?: string;
    gridColumnStart?: string;
    /** @deprecated This is a legacy alias of `gap`. */
    gridGap?: string;
    gridRow?: string;
    gridRowEnd?: string;
    /** @deprecated This is a legacy alias of `rowGap`. */
    gridRowGap?: string;
    gridRowStart?: string;
    gridTemplate?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    height?: string;
    hyphens?: string;
    /** @deprecated */
    imageOrientation?: string;
    imageRendering?: string;
    inlineSize?: string;
    inset?: string;
    insetBlock?: string;
    insetBlockEnd?: string;
    insetBlockStart?: string;
    insetInline?: string;
    insetInlineEnd?: string;
    insetInlineStart?: string;
    isolation?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    left?: string;
    readonly length?: number;
    letterSpacing?: string;
    lightingColor?: string;
    lineBreak?: string;
    lineHeight?: string;
    listStyle?: string;
    listStyleImage?: string;
    listStylePosition?: string;
    listStyleType?: string;
    margin?: string;
    marginBlock?: string;
    marginBlockEnd?: string;
    marginBlockStart?: string;
    marginBottom?: string;
    marginInline?: string;
    marginInlineEnd?: string;
    marginInlineStart?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marker?: string;
    markerEnd?: string;
    markerMid?: string;
    markerStart?: string;
    mask?: string;
    maskClip?: string;
    maskComposite?: string;
    maskImage?: string;
    maskMode?: string;
    maskOrigin?: string;
    maskPosition?: string;
    maskRepeat?: string;
    maskSize?: string;
    maskType?: string;
    maxBlockSize?: string;
    maxHeight?: string;
    maxInlineSize?: string;
    maxWidth?: string;
    minBlockSize?: string;
    minHeight?: string;
    minInlineSize?: string;
    minWidth?: string;
    mixBlendMode?: string;
    objectFit?: string;
    objectPosition?: string;
    offset?: string;
    offsetDistance?: string;
    offsetPath?: string;
    offsetRotate?: string;
    opacity?: string;
    order?: string;
    orphans?: string;
    outline?: string;
    outlineColor?: string;
    outlineOffset?: string;
    outlineStyle?: string;
    outlineWidth?: string;
    overflow?: string;
    overflowAnchor?: string;
    overflowWrap?: string;
    overflowX?: string;
    overflowY?: string;
    overscrollBehavior?: string;
    overscrollBehaviorBlock?: string;
    overscrollBehaviorInline?: string;
    overscrollBehaviorX?: string;
    overscrollBehaviorY?: string;
    padding?: string;
    paddingBlock?: string;
    paddingBlockEnd?: string;
    paddingBlockStart?: string;
    paddingBottom?: string;
    paddingInline?: string;
    paddingInlineEnd?: string;
    paddingInlineStart?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    pageBreakAfter?: string;
    pageBreakBefore?: string;
    pageBreakInside?: string;
    paintOrder?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    placeContent?: string;
    placeItems?: string;
    placeSelf?: string;
    pointerEvents?: string;
    position?: string;
    printColorAdjust?: string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    rowGap?: string;
    rubyPosition?: string;
    scale?: string;
    scrollBehavior?: string;
    scrollMargin?: string;
    scrollMarginBlock?: string;
    scrollMarginBlockEnd?: string;
    scrollMarginBlockStart?: string;
    scrollMarginBottom?: string;
    scrollMarginInline?: string;
    scrollMarginInlineEnd?: string;
    scrollMarginInlineStart?: string;
    scrollMarginLeft?: string;
    scrollMarginRight?: string;
    scrollMarginTop?: string;
    scrollPadding?: string;
    scrollPaddingBlock?: string;
    scrollPaddingBlockEnd?: string;
    scrollPaddingBlockStart?: string;
    scrollPaddingBottom?: string;
    scrollPaddingInline?: string;
    scrollPaddingInlineEnd?: string;
    scrollPaddingInlineStart?: string;
    scrollPaddingLeft?: string;
    scrollPaddingRight?: string;
    scrollPaddingTop?: string;
    scrollSnapAlign?: string;
    scrollSnapStop?: string;
    scrollSnapType?: string;
    scrollbarGutter?: string;
    shapeImageThreshold?: string;
    shapeMargin?: string;
    shapeOutside?: string;
    shapeRendering?: string;
    stopColor?: string;
    stopOpacity?: string;
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeMiterlimit?: string;
    strokeOpacity?: string;
    strokeWidth?: string;
    tabSize?: string;
    tableLayout?: string;
    textAlign?: string;
    textAlignLast?: string;
    textAnchor?: string;
    textCombineUpright?: string;
    textDecoration?: string;
    textDecorationColor?: string;
    textDecorationLine?: string;
    textDecorationSkipInk?: string;
    textDecorationStyle?: string;
    textDecorationThickness?: string;
    textEmphasis?: string;
    textEmphasisColor?: string;
    textEmphasisPosition?: string;
    textEmphasisStyle?: string;
    textIndent?: string;
    textOrientation?: string;
    textOverflow?: string;
    textRendering?: string;
    textShadow?: string;
    textTransform?: string;
    textUnderlineOffset?: string;
    textUnderlinePosition?: string;
    top?: string;
    touchAction?: string;
    transform?: string;
    transformBox?: string;
    transformOrigin?: string;
    transformStyle?: string;
    translate?: string;
    unicodeBidi?: string;
    userSelect?: string;
    verticalAlign?: string;
    visibility?: string;
    whiteSpace?: string;
    widows?: string;
    width?: string;
    willChange?: string;
    wordBreak?: string;
    wordSpacing?: string;
    writingMode?: string;
    zIndex?: string;
}