import { useEffect, useMemo, useRef, useState } from 'react';
import { FAST_INTERVAL, nodes } from 'config/constants';
import { ethers } from 'ethers';
import _ from 'lodash';

const promises = [];
for (let i = 0; i < nodes.length; i++) {
  promises.push(fetch(nodes[i]));
}
Promise.any(promises).then((response) => {
  window._workingNode = response.url;
});

const randomNode = _.sample(nodes);

export default function useSimpleRpcProvider() {
  const [workingNode, setWorkingNode] = useState<string>(window._workingNode ?? randomNode);
  const timer = useRef<any>(null);

  useEffect(() => {
    const updateWorkingNode = () => {
      if (window._workingNode && workingNode !== window._workingNode) {
        setWorkingNode(window._workingNode);
      }
    };

    updateWorkingNode();
    timer.current = setInterval(() => {
      updateWorkingNode();
    }, FAST_INTERVAL);

    return () => {
      clearInterval(timer.current);
    };
  }, [workingNode]);

  return useMemo(() => new ethers.providers.StaticJsonRpcProvider(workingNode), [workingNode]);
}
