// A Star 알고리즘

function Q1() {
  // [0,0] 위치에서 [2,2] 위치로 가는 최단 경로를 구한다면
  const road = [
    [0, 1, 1],
    [3, 2, 5],
    [2, 4, 0],
  ];
  const LEN_X = 3;
  const LEN_Y = 3;
  const dummyNode = { id: 0, parent: null };
  const startNode = { id: 0, pos: [0, 0], parent: dummyNode, g: 0, h: 0, f: 0 };
  const endNode = { id: 8, pos: [2, 2], parent: null, g: 0, h: 0, f: 0 };
  let count = 0;
  let ol = {};
  let cl = { [startNode.id]: startNode };
  let curNode = startNode;
  while (count !== 8) {
    count += 1;
    // 근접 노드 체크

    let [y, x] = curNode.pos;
    let targetId = 0;

    const top = y - 1;
    if (top >= 0) {
      targetId = top * LEN_X + x;
      if (targetId !== curNode.parent.id) addNodeToOl([top, x]);
    }
    const bottom = y + 1;
    if (bottom < LEN_Y) {
      targetId = bottom * LEN_X + x;
      if (targetId !== curNode.parent.id) addNodeToOl([bottom, x]);
    }
    const left = x - 1;
    if (left >= 0) {
      targetId = y * LEN_X + left;
      if (targetId !== curNode.parent.id) addNodeToOl([y, left]);
    }
    const right = x + 1;
    if (right < LEN_X) {
      targetId = y * LEN_X + right;
      if (targetId !== curNode.parent.id) addNodeToOl([y, right]);
    }

    // open list 중 f 값이 최소인 close list로 이동
    let minCost = null;
    let nextClNode = null; // 최소 값이 다수 일 경우 배열로 변경해야 할듯?

    Object.entries(ol).forEach(([key, node]) => {
      if (minCost === null || minCost >= node.f) {
        minCost = node.f;
        nextClNode = { key, node };
      }
    });

    cl[nextClNode.key] = nextClNode.node;
    curNode = nextClNode.node;
  }

  // 추가된 close list node와 근접한 노드를 체크
  function addNodeToOl(nextPos) {
    const [ny, nx] = nextPos;
    const targetId = ny * LEN_X + nx;
    console.log('현재 노드', curNode);
    if (!ol.hasOwnProperty(targetId)) {
      //console.log('targetId', targetId);
      const g = curNode.g + road[ny][nx];
      const h = calcHypo(nextPos, endNode.pos, road);
      const f = g + h;

      ol[targetId] = {
        id: targetId,
        pos: [ny, nx],
        parent: curNode,
        g,
        h,
        f,
      };
      // console.log(ol);
    }
  }
}
Q1();

function calcHypo(startPos, endPos, board) {
  let [sx, sy] = startPos;
  let [ex, ey] = endPos;
  let w = 0;
  let h = 0;

  while (sx != ex) {
    if (sx < ex) {
      sx += 1;
      w += board[sy][sx];
    } else if (sx > ex) {
      sx -= 1;
      w += board[sy][sx];
    }
  }

  while (sy != ey) {
    if (sy < ey) {
      sy += 1;
      h += board[sy][sx];
    } else if (sy > ey) {
      sy -= 1;
      h += board[sy][sx];
    }
  }

  return parseFloat(Math.sqrt(w * w + h * h).toFixed(2));
}
