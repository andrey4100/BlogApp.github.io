import React from 'react';

import styles from './Error.module.scss';

function Error() {
  return (
    <div className={styles.error}>
      <p>Упс, что-то пошло не так. Сейчас исправим =)</p>
    </div>
  );
}

export default Error;