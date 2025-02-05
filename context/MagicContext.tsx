'use client';

import { getNetworkUrl } from '@/utils/network';
import { OAuthExtension } from '@magic-ext/oauth';
import { Magic as MagicBase } from 'magic-sdk';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { FlowExtension } from '@magic-ext/flow';
import * as fcl from '@onflow/fcl';
import { SolanaExtension } from '@magic-ext/solana';
import { Connection } from '@solana/web3.js';

export type Magic = MagicBase<
	OAuthExtension[] & FlowExtension[] & SolanaExtension[]
>;

type MagicContextType = {
	magic: Magic | null;
	token: string;
	setToken: Dispatch<SetStateAction<string>>;
	solanaConnection: Connection | null;
};

const MagicContext = createContext<MagicContextType>({
	magic: null,
	token: '',
	setToken: () => {},
	solanaConnection: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
	const [magic, setMagic] = useState<Magic | null>(null);
	const [token, setToken] = useState('');
	const [solanaConnection, setSolanaConnection] = useState<Connection | null>(
		null
	);

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
			const magic = new MagicBase(
				process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
				{
					extensions: [
						new OAuthExtension(),
						new FlowExtension({
							rpcUrl: 'https://rest-mainnet.onflow.org',
							network: 'mainnet',
						}),
						new SolanaExtension({
							rpcUrl: getNetworkUrl(),
						}),
					],
				}
			);
			setMagic(magic);
			fcl.config().put(
				'accessNode.api',
				'https://rest-mainnet.onflow.org'
			);
			const connection = new Connection(getNetworkUrl());
			setSolanaConnection(connection);
		}
	}, []);

	const value = useMemo(() => {
		return {
			magic,
			solanaConnection,
			token,
			setToken,
		};
	}, [magic, solanaConnection, token]);

	return (
		<MagicContext.Provider value={value}>{children}</MagicContext.Provider>
	);
};

export default MagicProvider;
