export interface GameResultPayload {
  name: string;
  score: number | string;
  finishtime: string;
  timestamp?: string;
}

export interface Ranker {
  rank: number;
  name: string;
  finishtime: string;
  score: string;
}

// 1. 구글 시트로 결과 전송
export async function sendGameResultToGoogleSheet(
  payload: GameResultPayload
): Promise<{ success: boolean; message?: string }> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();

  if (!scriptUrl) {
    console.warn(
      'NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 설정되지 않아 구글 시트 전송을 건너뜁니다.'
    );
    return { success: false, message: 'URL이 설정되지 않았습니다.' };
  }

  try {
    const now = new Date();
    const timestamp =
      payload.timestamp ||
      now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

    const formData = new URLSearchParams();
    formData.append('timestamp', timestamp);
    formData.append('name', payload.name);
    formData.append('score', String(payload.score));
    formData.append('finishtime', payload.finishtime);

    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('구글 시트로 게임 결과 전송 완료:', {
      timestamp,
      name: payload.name,
      score: payload.score,
      finishtime: payload.finishtime,
    });
    return { success: true };
  } catch (error) {
    console.error('구글 시트 전송 중 오류 발생:', error);
    return { success: false, message: String(error) };
  }
}

// 2. 구글 시트에서 상위 3명 랭킹 가져오기 (종료시간 오름차순)
export async function fetchTop3Rankings(): Promise<Ranker[]> {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();
  if (!scriptUrl) return [];

  try {
    const res = await fetch(scriptUrl, {
      method: 'GET',
    });
    const data = await res.json();
    if (data && data.status === 'success' && Array.isArray(data.top3)) {
      return data.top3;
    }
    return [];
  } catch (error) {
    console.error('랭킹 데이터 조회 실패:', error);
    return [];
  }
}
