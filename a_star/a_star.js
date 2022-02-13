// [0,0] 위치에서 [2,2] 위치로 가는 최단 경로를 구한다면?
// 조건 1. 따로 이동 불가 지점은 존재하지 않는다.
// 조건 2. 길은 2차원 배열로 이뤄져있으며, 각 요소의 값은 이동 시 비용이다.

function Q1() {
  const road = [
    [0, 4, 1],
    [3, 2, 5],
    [3, 4, 0],
  ];
  const LEN_X = 3;
  const LEN_Y = 3;
  const dummyNode = { id: -1, parentNode: null };
  const startNode = { id: 0, pos: [0, 0], parentNode: dummyNode, g: 0, h: 0, f: 0 };
  const endNode = { id: 8, pos: [2, 2], parentNode: null, g: 0, h: 0, f: 0 };
  let ol = {};
  let cl = { [startNode.id]: startNode };
  let curNode = startNode;
  let nextNodeId = 0;
  let top, bottom, left, right;

  while (curNode.id !== endNode.id) {
    let [y, x] = curNode.pos;
    top = y - 1;
    bottom = y + 1;
    left = x - 1;
    right = x + 1;

    if (top >= 0) {
      nextNodeId = top * LEN_X + x;
      if (nextNodeId !== curNode.parentNode.id) addNodeToOl([top, x]);
    }

    if (bottom < LEN_Y) {
      nextNodeId = bottom * LEN_X + x;
      if (nextNodeId !== curNode.parentNode.id) addNodeToOl([bottom, x]);
    }

    if (left >= 0) {
      nextNodeId = y * LEN_X + left;
      if (nextNodeId !== curNode.parentNode.id) addNodeToOl([y, left]);
    }

    if (right < LEN_X) {
      nextNodeId = y * LEN_X + right;
      if (nextNodeId !== curNode.parentNode.id) addNodeToOl([y, right]);
    }

    // open list 중 f 값이 최소인 close list로 이동
    let minCost = null;
    // 최소 값이 다수 일 경우 배열로 변경해야 할 듯
    let nextClNode = null;

    Object.entries(ol).forEach(([key, node]) => {
      if (minCost === null || minCost >= node.f) {
        minCost = node.f;
        nextClNode = { key, node };
      }
    });

    // add to cl
    cl[nextClNode.key] = nextClNode.node;
    // remove to ol
    delete ol[nextClNode.key];
    // change curNode
    curNode = nextClNode.node;
  }

  // end -> start 경로 확인
  let result = [];
  while (curNode.id !== dummyNode.id) {
    result.unshift(curNode.id);
    curNode = cl[curNode.id].parentNode;
  }

  // ol에 다음 이동 노드들 추가
  function addNodeToOl(nextPos) {
    const [ny, nx] = nextPos;

    if (!ol.hasOwnProperty(nextNodeId)) {
      const g = curNode.g + road[ny][nx];
      const h = calcHypo(nextPos, endNode.pos, road);
      const f = g + h;

      ol[nextNodeId] = {
        id: nextNodeId,
        pos: [ny, nx],
        parentNode: curNode,
        g,
        h,
        f,
      };
    }
  }

  return result;
}

// 빗변 구하기 함수
function calcHypo(startPos, endPos, road) {
  let [sx, sy] = startPos;
  let [ex, ey] = endPos;
  let w = 0;
  let h = 0;

  while (sx != ex) {
    if (sx < ex) {
      sx += 1;
      w += road[sy][sx];
    } else if (sx > ex) {
      sx -= 1;
      w += road[sy][sx];
    }
  }

  while (sy != ey) {
    if (sy < ey) {
      sy += 1;
      h += road[sy][sx];
    } else if (sy > ey) {
      sy -= 1;
      h += road[sy][sx];
    }
  }

  return parseFloat(Math.sqrt(w * w + h * h).toFixed(2));
}

console.log(Q1());
