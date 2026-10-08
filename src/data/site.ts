export const profile = {
 name: 'Izumi', role: 'Research Portfolio & Technical Wiki', affiliation: '所属未設定',
 intro: 'ロボティクス、数値計算、そして実装。理論を理解し、コードで確かめるための研究ノート。',
 github: 'https://github.com/izumi0x01', contact: '', cv: '',
 fields: ['Robotics', 'Numerical Computing', 'Motion Planning'],
 education: ['学歴・経歴はプロフィール設定から追加してください。'], awards: ['受賞歴は未登録です。'],
};
export const navigation = [['Home',''],['About','about/'],['Research','research/'],['Publications','publications/'],['Projects','projects/'],['Wiki','wiki/']] as const;
export const href = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const publications = [{id:'demo-planning', title:'Learning motion planning through interactive examples', authors:'Sample Author', venue:'デモ用の架空論文・実在する研究業績ではありません', year:2026, type:'conference', doi:'', pdf:'', bibtex:'@inproceedings{demo-planning,\n  title={Learning motion planning through interactive examples},\n  author={Sample Author},\n  year={2026},\n  note={Fictional demonstration entry}\n}'}];
export const research = [
 {title:'Motion Planning',subtitle:'経路探索とロボットの動き',description:'サンプル研究テーマ。障害物を避けながら目標へ到達するための経路探索を、RRTの実装を通じて考えます。',tags:['Robotics','RRT','Python'],wiki:'wiki/robotics/rrt/',publicationIds:['demo-planning'],image:'planning.svg',video:'',github:'https://github.com/izumi0x01'},
 {title:'Robot Kinematics',subtitle:'幾何から理解するロボティクス',description:'サンプル研究テーマ。回転行列と順運動学を使い、関節角度と手先位置の関係を可視化します。',tags:['Kinematics','NumPy'],wiki:'wiki/robotics/kinematics/',publicationIds:[],image:'kinematics.svg',video:'',github:'https://github.com/izumi0x01'}];
export const projects = [{title:'Interactive Python Notes',description:'このサイトのブラウザ内Python実行環境。数値計算とMatplotlibの可視化を記事の中で試せます。',tags:['Pyodide','CodeMirror','Astro'],image:'planning.svg',github:'https://github.com/izumi0x01/izumi0x01.github.io',wiki:'wiki/python/matplotlib/'}];
