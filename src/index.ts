import Hack from './Hack';
import getOffsets from './offsets';

(async () => {
  try {
    const offsets = await getOffsets();
    const hack = new Hack({
      offsets,
    });

    hack.start();
  } catch (error) {
    console.error(error);
  }
})();
