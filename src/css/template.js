export default ({ family, italic, weight, urls: { eot, woff2, woff, ttf } }) => `
  @font-face {
    font-family: '${family}';
    font-style: ${italic ? 'italic' : 'normal'};
    font-weight: ${weight};
    ${eot ? `src: url('${eot}');` : ''}
    src: local('${family}')
    ${eot ? `, url('${eot}') format('embedded-opentype')` : ''}
    ${woff2 ? `, url('${woff2}') format('woff2')` : ''}
    ${woff ? `, url('${woff}') format('woff')` : ''}
    ${ttf ? `, url('${ttf}') format('ttf')` : ''};
  }
`;
