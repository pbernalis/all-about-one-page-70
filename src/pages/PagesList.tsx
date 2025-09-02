import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit2, Eye, Copy, Edit, Trash2, ExternalLink, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { pagesApi } from "@/api/pages";

type PageListItem = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
};

export default function PagesList() {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { toast } = useToast();
  const nav = useNavigate();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const data = await pagesApi.list();
      setPages(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load pages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    try {
      console.log("Creating page with:", { slug, title: newTitle });
      const page = await pagesApi.create(slug, newTitle);
      console.log("Page created:", page);
      setPages(prev => [...prev, page]);
      setCreateOpen(false);
      setNewTitle("");
      setNewSlug("");
      toast({ title: "Success", description: "Page created successfully" });
      console.log("Navigating to:", `/studio/chat?pageId=${page.id}&template=choose`);
      nav(`/studio/chat?pageId=${page.id}&template=choose`);
    } catch (error: any) {
      console.error("Failed to create page:", error);
      const msg = error.message.includes("slug_conflict") ? "Slug already exists" : "Failed to create page";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDuplicate = async (pageItem: PageListItem) => {
    const defTitle = `${pageItem.title} (copy)`;
    const defSlug = `${pageItem.slug}-copy`;
    const title = prompt("Title for the new page:", defTitle) || defTitle;
    const slug = prompt("Slug for the new page:", defSlug) || defSlug;
    
    try {
      const newPage = await pagesApi.duplicate(pageItem.id, { title, slug });
      setPages(prev => [...prev, newPage]);
      toast({ title: "Success", description: "Page duplicated successfully" });
      nav(`/studio/chat?pageId=${newPage.id}`);
    } catch (error: any) {
      const msg = error.message.includes("slug_conflict") ? "Copy slug already exists" : "Failed to duplicate page";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const rename = async (pageItem: PageListItem) => {
    const title = prompt("New title:", pageItem.title) ?? pageItem.title;
    const slug = prompt("New slug:", pageItem.slug) ?? pageItem.slug;
    
    try {
      await pagesApi.rename(pageItem.id, { title, slug });
      setPages(prev => prev.map(p => p.id === pageItem.id ? { ...p, title, slug } : p));
      toast({ title: "Success", description: "Page renamed successfully" });
    } catch (error: any) {
      const msg = error.message.includes("slug_taken") ? "Slug already exists" : "Failed to rename page";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pagesApi.delete(id);
      setPages(prev => prev.filter(p => p.id !== id));
      toast({ title: "Success", description: "Page deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete page", variant: "destructive" });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await pagesApi.publish(id);
      setPages(prev => prev.map(p => p.id === id ? { ...p, status: "published" } : p));
      toast({ title: "Success", description: "Page published successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish page", variant: "destructive" });
    }
  };

  // Search/filter
  const filtered = useMemo(() => {
    const s = filter.trim().toLowerCase();
    console.log('PagesList filtered - pages:', pages, 'isArray:', Array.isArray(pages));
    if (!s) return pages;
    return pages.filter(p =>
      p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
    );
  }, [pages, filter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const start = (page - 1) * perPage;
  console.log('PagesList pagination - filtered:', filtered, 'isArray:', Array.isArray(filtered), 'start:', start, 'perPage:', perPage);
  const pageRows = Array.isArray(filtered) ? filtered.slice(start, start + perPage) : [];

  // Selection
  const headerCb = useRef<HTMLInputElement>(null);
  console.log('PagesList selection - pageRows:', pageRows, 'isArray:', Array.isArray(pageRows));
  const allIdsOnPage = Array.isArray(pageRows) ? pageRows.map(r => r.id) : [];
  const selectedOnPageCount = allIdsOnPage.filter(id => selected.has(id)).length;
  const allOnPageSelected = selectedOnPageCount === allIdsOnPage.length && allIdsOnPage.length > 0;
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected;

  useEffect(() => {
    if (headerCb.current) headerCb.current.indeterminate = someOnPageSelected;
  }, [someOnPageSelected]);

  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allOnPageSelected) {
      allIdsOnPage.forEach(id => next.delete(id));
    } else {
      allIdsOnPage.forEach(id => next.add(id));
    }
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const clearSelection = () => setSelected(new Set());

  // BULK actions
  const runBulk = async (fnName: "publish" | "delete" | "duplicate") => {
    if (selected.size === 0) return;

    const ids = Array.from(selected);
    if (fnName === "delete") {
      if (!confirm(`Delete ${ids.length} page(s)? This cannot be undone.`)) return;
    }

    for (const id of ids) {
      const pageItem = pages.find(p => p.id === id);
      if (!pageItem) continue;
      try {
        if (fnName === "publish") await pagesApi.publish(id);
        if (fnName === "delete") await pagesApi.delete(id);
        if (fnName === "duplicate") {
          await pagesApi.duplicate(id, {
            title: `${pageItem.title} (copy)`,
            slug: `${pageItem.slug}-copy`,
          });
        }
      } catch (err) {
        console.error(`Failed ${fnName} for ${pageItem.title}:`, err);
      }
    }
    clearSelection();
    loadPages();
  };

  if (loading) {
    return <div className="p-8">Loading pages...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => nav('/studio/chat')}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            AI Chat
          </Button>
          
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Page
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Page title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (optional)</label>
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="page-slug"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search by title or slug..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="max-w-sm"
        />

        {/* Bulk bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
            <div className="text-sm">
              {selected.size} selected
            </div>
            <div className="ml-auto flex gap-2">
              <Button size="sm" onClick={() => runBulk("publish")}>Publish</Button>
              <Button size="sm" variant="outline" onClick={() => runBulk("duplicate")}>Duplicate</Button>
              <Button size="sm" variant="destructive" onClick={() => runBulk("delete")}>Delete</Button>
              <Button size="sm" variant="outline" onClick={clearSelection}>Clear</Button>
            </div>
          </div>
        )}

        {pageRows.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No pages found. Create your first page to get started!</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      ref={headerCb}
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAllOnPage}
                      className="accent-primary"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((pageItem) => (
                  <TableRow key={pageItem.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(pageItem.id)}
                        onChange={() => toggleOne(pageItem.id)}
                        className="accent-primary"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pageItem.title}</TableCell>
                    <TableCell className="font-mono text-sm">{pageItem.slug}</TableCell>
                    <TableCell>
                      <Badge variant={pageItem.status === "published" ? "default" : "secondary"}>
                        {pageItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <Link to={`/studio/chat?pageId=${pageItem.id}`} className="flex items-center gap-2">
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          
                          {pageItem.status === "published" && (
                            <DropdownMenuItem asChild>
                              <a href={`/api/public/pages/${pageItem.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Preview
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </DropdownMenuItem>
                          )}
                          
                          {pageItem.status === "draft" && (
                            <DropdownMenuItem onClick={() => handlePublish(pageItem.id)} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => handleDuplicate(pageItem)} className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => rename(pageItem)} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Page</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{pageItem.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(pageItem.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-3 justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Showing {start + 1}-{Math.min(start + perPage, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-8 border rounded-md px-2 text-sm"
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="text-sm tabular-nums">{page} / {totalPages}</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}