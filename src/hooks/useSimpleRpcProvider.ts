import { useEffect, useMemo, useRef, useState } from 'react';
import { FAST_INTERVAL, nodes } from 'config/constants';
import { ethers } from 'ethers';

const promises = [];
for (let i = 0; i < nodes.length; i++) {
  promises.push(fetch(nodes[i]));
}
Promise.any(promises).then((response) => {
  window._workingNode = response.url;
});

export default function useSimpleRpcProvider(): ethers.providers.StaticJsonRpcProvider | undefined {
  const [workingNode, setWorkingNode] = useState<string | undefined>(window._workingNode);
  const timer = useRef<any>(null);

  useEffect(() => {
    const updateWorkingNode = () => {
      if (!workingNode && window._workingNode) {
        setWorkingNode(window._workingNode);
      }
      if (workingNode) {
        clearInterval(timer.current);
      }
    };

    if (!workingNode) {
      updateWorkingNode();
      timer.current = setInterval(updateWorkingNode, FAST_INTERVAL);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [workingNode]);

  return useMemo(
    () => (workingNode ? new ethers.providers.StaticJsonRpcProvider(workingNode) : undefined),
    [workingNode]
  );
}
