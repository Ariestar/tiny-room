import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default async function DebugPage() {
    const session = await auth();

    // @ts-expect-error custom field
    const githubToken = session?.githubAccessToken as string | undefined;

    let githubUserData = null;
    let githubError = null;

    if (githubToken) {
        try {
            const response = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (response.ok) {
                githubUserData = await response.json();
            } else {
                githubError = `GitHub API error: ${response.status} ${response.statusText}`;
            }
        } catch (error) {
            githubError = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Debug Information</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Session Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><strong>User ID:</strong> {session?.user?.id || 'Not found'}</p>
                        <p><strong>User Email:</strong> {session?.user?.email || 'Not found'}</p>
                        <p><strong>User Name:</strong> {session?.user?.name || 'Not found'}</p>
                        <p><strong>GitHub Token:</strong> {githubToken ? `${githubToken.substring(0, 10)}...` : 'Not found'}</p>
                    </div>
                </CardContent>
            </Card>

            {githubToken && (
                <Card>
                    <CardHeader>
                        <CardTitle>GitHub API Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {githubError ? (
                            <div className="text-red-600">
                                <p><strong>Error:</strong> {githubError}</p>
                            </div>
                        ) : githubUserData ? (
                            <div className="space-y-2">
                                <p><strong>GitHub User:</strong> {githubUserData.login}</p>
                                <p><strong>Public Repos:</strong> {githubUserData.public_repos}</p>
                                <p><strong>Followers:</strong> {githubUserData.followers}</p>
                                <p><strong>Following:</strong> {githubUserData.following}</p>
                            </div>
                        ) : (
                            <p>Loading GitHub data...</p>
                        )}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><strong>GITHUB_ID:</strong> {process.env.GITHUB_ID ? 'Set' : 'Not set'}</p>
                        <p><strong>GITHUB_SECRET:</strong> {process.env.GITHUB_SECRET ? 'Set' : 'Not set'}</p>
                        <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
                        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
