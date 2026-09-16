
import { db } from '@/config/firebase';
import {
    collection,
    onSnapshot,
    query,
    QueryConstraint,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useFirestoreSubscription<T>(
	collectionName: string,
	constraints: QueryConstraint[] = [],
) {
	const [data, setData] = useState<Record<string, T>>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		const q = query(collection(db, collectionName), ...constraints);

		const unsubscribe = onSnapshot(
			q,
			snapshot => {
				const itemsMap: Record<string, T> = {};
				snapshot.forEach(docSnap => {
					itemsMap[docSnap.id] = {
						id: docSnap.id,
						...docSnap.data(),
					} as T;
				});
				setData(itemsMap);
				setLoading(false);
			},
			err => {
				setError(
					err.message || `Failed to fetch from ${collectionName}`,
				);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [collectionName, JSON.stringify(constraints)]);

	return { data, loading, error };
}
